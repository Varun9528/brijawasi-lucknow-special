import {
  getGoogleTokens,
  saveGoogleTokens,
  hasRepliedToReview,
  recordRepliedReview,
  GoogleTokens,
} from "./storage";
import { generateRestaurantOwnerReply } from "./openai";

export interface GoogleReviewItem {
  reviewId: string;
  reviewer?: {
    displayName?: string;
    profilePhotoUrl?: string;
    isAnonymous?: boolean;
  };
  starRating: "STAR_RATING_UNSPECIFIED" | "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
  comment?: string;
  createTime?: string;
  updateTime?: string;
  reviewReply?: {
    comment: string;
    updateTime?: string;
  };
}

export interface SyncResult {
  success: boolean;
  message: string;
  totalFetched: number;
  repliedCount: number;
  skippedCount: number;
  errors: string[];
  replies: Array<{
    reviewId: string;
    reviewerName: string;
    starRating: number;
    reply: string;
  }>;
}

const STAR_RATING_MAP: Record<string, number> = {
  FIVE: 5,
  FOUR: 4,
  THREE: 3,
  TWO: 2,
  ONE: 1,
};

function getClientCredentials(businessId: string = "brijawasi") {
  return {
    clientId: process.env.GOOGLE_CLIENT_ID_BRIJAWASI || process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET_BRIJAWASI || process.env.GOOGLE_CLIENT_SECRET,
    defaultAccount: process.env.GOOGLE_ACCOUNT_ID_BRIJAWASI || process.env.GOOGLE_ACCOUNT_ID,
    defaultLocation: process.env.GOOGLE_LOCATION_ID_BRIJAWASI || process.env.GOOGLE_LOCATION_ID,
  };
}

/**
 * Generate Google OAuth 2.0 authorization URL
 */
export function getGoogleOAuthUrl(origin: string, businessId: string = "brijawasi"): string {
  const { clientId } = getClientCredentials(businessId);
  if (!clientId) {
    throw new Error(`GOOGLE_CLIENT_ID is not configured in environment variables.`);
  }

  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `${origin}/api/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/business.manage",
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state: businessId,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange OAuth authorization code for tokens
 */
export async function exchangeGoogleCode(
  code: string,
  origin: string,
  businessId: string = "brijawasi"
): Promise<GoogleTokens> {
  const { clientId, clientSecret, defaultAccount, defaultLocation } = getClientCredentials(businessId);
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI || `${origin}/api/google/callback`;

  if (!clientId || !clientSecret) {
    throw new Error(`Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET.`);
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Google token exchange failed: ${res.status} - ${errorBody}`);
  }

  const data = await res.json();

  // Try to discover accounts/locations automatically
  const accountInfo = await discoverPrimaryLocation(data.access_token);

  const tokens: GoogleTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: Date.now() + (data.expires_in || 3600) * 1000,
    token_type: data.token_type,
    scope: data.scope,
    accountId: accountInfo?.accountId || defaultAccount,
    locationId: accountInfo?.locationId || defaultLocation,
    connectedEmail: accountInfo?.email,
    updatedAt: new Date().toISOString(),
  };

  await saveGoogleTokens(tokens, businessId);
  return tokens;
}

/**
 * Discover the primary Google Business Profile account and location
 */
async function discoverPrimaryLocation(
  accessToken: string
): Promise<{ accountId?: string; locationId?: string; email?: string } | null> {
  try {
    const accRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!accRes.ok) return null;
    const accData = await accRes.json();
    const accounts = accData.accounts || [];
    if (accounts.length === 0) return null;

    const primaryAccount = accounts[0];
    const accountName = primaryAccount.name; // e.g. "accounts/123456"

    const locRes = await fetch(
      `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations?readMask=name,title`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    let locationName: string | undefined;
    if (locRes.ok) {
      const locData = await locRes.json();
      const locations = locData.locations || [];
      if (locations.length > 0) {
        locationName = locations[0].name; // e.g. "locations/987654"
      }
    }

    return {
      accountId: accountName,
      locationId: locationName,
    };
  } catch (err) {
    console.warn("[Google Business] Location auto-discovery warning:", err);
    return null;
  }
}

/**
 * Get a valid access token, refreshing if necessary
 */
export async function getValidAccessToken(businessId: string = "default"): Promise<{
  accessToken: string;
  accountName: string;
  locationName: string;
} | null> {
  const tokens = await getGoogleTokens(businessId);
  if (!tokens) return null;

  const { clientId, clientSecret, defaultAccount, defaultLocation } = getClientCredentials(businessId);
  const refreshToken = tokens.refresh_token;

  let accessToken = tokens.access_token;
  const isExpired = tokens.expiry_date ? Date.now() >= tokens.expiry_date - 60000 : true;

  if ((!accessToken || isExpired) && refreshToken && clientId && clientSecret) {
    try {
      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });

      if (res.ok) {
        const refreshData = await res.json();
        accessToken = refreshData.access_token;
        await saveGoogleTokens(
          {
            ...tokens,
            access_token: accessToken,
            expiry_date: Date.now() + (refreshData.expires_in || 3600) * 1000,
            updatedAt: new Date().toISOString(),
          },
          businessId
        );
      } else {
        console.error(`[Google OAuth] Refresh token request failed for ${businessId}:`, await res.text());
        return null;
      }
    } catch (err) {
      console.error(`[Google OAuth] Refresh exception for ${businessId}:`, err);
      return null;
    }
  }

  const accountName = tokens.accountId || defaultAccount;
  const locationName = tokens.locationId || defaultLocation;

  if (!accessToken || !accountName || !locationName) {
    return null;
  }

  return { accessToken, accountName, locationName };
}

/**
 * Fetch recent reviews from Google My Business v4 API
 */
export async function fetchGoogleReviews(
  accessToken: string,
  accountName: string,
  locationName: string
): Promise<GoogleReviewItem[]> {
  const acc = accountName.startsWith("accounts/") ? accountName : `accounts/${accountName}`;
  const loc = locationName.startsWith("locations/") ? locationName : `locations/${locationName}`;

  const url = `https://mybusiness.googleapis.com/v4/${acc}/${loc}/reviews?pageSize=50`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Reviews fetch failed: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  return data.reviews || [];
}

/**
 * Publish an owner reply to a specific review using Google My Business API
 */
export async function replyToGoogleReview(
  accessToken: string,
  accountName: string,
  locationName: string,
  reviewId: string,
  replyText: string
): Promise<boolean> {
  const acc = accountName.startsWith("accounts/") ? accountName : `accounts/${accountName}`;
  const loc = locationName.startsWith("locations/") ? locationName : `locations/${locationName}`;

  const url = `https://mybusiness.googleapis.com/v4/${acc}/${loc}/reviews/${reviewId}/reply`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment: replyText }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Review Reply API failed: ${res.status} - ${errText}`);
  }

  return true;
}

/**
 * Synchronize and automatically reply to any unreplied Google reviews
 */
export async function processAndReplyToReviews(
  source: "cron" | "webhook" | "manual",
  businessId: string = "default"
): Promise<SyncResult> {
  const errors: string[] = [];
  const replies: Array<{
    reviewId: string;
    reviewerName: string;
    starRating: number;
    reply: string;
  }> = [];

  const authData = await getValidAccessToken(businessId);
  if (!authData) {
    return {
      success: false,
      message: `Google Business Profile is not connected or authorization is pending for ${businessId}. Visit /api/google/oauth?businessId=${businessId} to connect.`,
      totalFetched: 0,
      repliedCount: 0,
      skippedCount: 0,
      errors: [`Google OAuth tokens missing or expired for ${businessId}.`],
      replies: [],
    };
  }

  const { accessToken, accountName, locationName } = authData;

  let reviews: GoogleReviewItem[] = [];
  try {
    reviews = await fetchGoogleReviews(accessToken, accountName, locationName);
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Failed to fetch reviews from Google API for ${businessId}.`,
      totalFetched: 0,
      repliedCount: 0,
      skippedCount: 0,
      errors: [errMsg],
      replies: [],
    };
  }

  let repliedCount = 0;
  let skippedCount = 0;

  for (const review of reviews) {
    const reviewId = review.reviewId;

    if (review.reviewReply && review.reviewReply.comment) {
      skippedCount++;
      continue;
    }

    const alreadyHandled = await hasRepliedToReview(reviewId, businessId);
    if (alreadyHandled) {
      skippedCount++;
      continue;
    }

    const reviewerName = review.reviewer?.displayName || "Customer";
    const starRating = STAR_RATING_MAP[review.starRating] || 5;
    const comment = review.comment || "";

    try {
      const generatedReply = await generateRestaurantOwnerReply(
        { reviewerName, starRating, comment },
        "Brijawasi Lucknow Special"
      );

      await replyToGoogleReview(
        accessToken,
        accountName,
        locationName,
        reviewId,
        generatedReply
      );

      await recordRepliedReview(
        {
          reviewId,
          reviewerName,
          starRating,
          originalComment: comment,
          replyText: generatedReply,
          repliedAt: new Date().toISOString(),
          source,
        },
        businessId
      );

      repliedCount++;
      replies.push({
        reviewId,
        reviewerName,
        starRating,
        reply: generatedReply,
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      errors.push(`Review ${reviewId} reply error: ${errMsg}`);
    }
  }

  return {
    success: errors.length === 0,
    message: `[${businessId}] Processed ${reviews.length} reviews. Published ${repliedCount} new AI replies. Skipped ${skippedCount} already-replied reviews.`,
    totalFetched: reviews.length,
    repliedCount,
    skippedCount,
    errors,
    replies,
  };
}

/**
 * Inspect Google integration configuration status per business
 */
export async function getGoogleIntegrationStatus(businessId: string = "default") {
  const { clientId, clientSecret, defaultAccount, defaultLocation } = getClientCredentials(businessId);
  const hasClientId = Boolean(clientId);
  const hasClientSecret = Boolean(clientSecret);
  const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key_here");
  const tokens = await getGoogleTokens(businessId);

  const isConnected = Boolean(tokens && (tokens.access_token || tokens.refresh_token));
  const hasLocationConfigured = Boolean(
    (tokens && tokens.accountId && tokens.locationId) ||
    (defaultAccount && defaultLocation)
  );

  return {
    businessId,
    isConfigured: hasClientId && hasClientSecret,
    isConnected,
    hasLocationConfigured,
    hasOpenAiKey,
    details: {
      hasClientId,
      hasClientSecret,
      hasRefreshToken: Boolean(tokens?.refresh_token),
      accountId: tokens?.accountId || defaultAccount || "Not set",
      locationId: tokens?.locationId || defaultLocation || "Not set",
      lastUpdated: tokens?.updatedAt || null,
    },
  };
}


