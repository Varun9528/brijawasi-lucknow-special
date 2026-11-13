import { NextRequest, NextResponse } from "next/server";
import { getGoogleOAuthUrl } from "@/lib/google-business";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const businessId = req.nextUrl.searchParams.get("businessId") || "brijawasi";

  try {
    const authUrl = getGoogleOAuthUrl(origin, businessId);
    return NextResponse.redirect(authUrl);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: "Google OAuth configuration missing.",
        message: msg,
        instructions: [
          "1. Go to Google Cloud Console (https://console.cloud.google.com).",
          "2. Enable Google My Business API & My Business Account Management API.",
          "3. Create an OAuth 2.0 Client ID (Web Application).",
          `4. Add Authorized Redirect URI: ${origin}/api/google/callback`,
          "5. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your Vercel/environment variables.",
        ],
      },
      { status: 400 }
    );
  }
}

