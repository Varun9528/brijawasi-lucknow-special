import fs from "fs";
import path from "path";

export interface GoogleTokens {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
  token_type?: string;
  scope?: string;
  accountId?: string;
  locationId?: string;
  connectedEmail?: string;
  updatedAt: string;
}

export interface RepliedReviewRecord {
  reviewId: string;
  reviewerName?: string;
  starRating?: number;
  originalComment?: string;
  replyText: string;
  repliedAt: string;
  source: "cron" | "webhook" | "manual";
}

const DATA_DIR = path.join(process.cwd(), "data");

function getTokensFilePath(businessId: string = "brijawasi"): string {
  return path.join(DATA_DIR, `google_tokens_${businessId}.json`);
}

function getRepliedReviewsFilePath(businessId: string = "brijawasi"): string {
  return path.join(DATA_DIR, `replied_reviews_${businessId}.json`);
}

// In-memory fallback per business for stateless execution
const memoryTokensMap = new Map<string, GoogleTokens>();
const memoryRepliedReviewsMap = new Map<string, Map<string, RepliedReviewRecord>>();

function getMemoryRepliedMap(businessId: string = "brijawasi"): Map<string, RepliedReviewRecord> {
  if (!memoryRepliedReviewsMap.has(businessId)) {
    memoryRepliedReviewsMap.set(businessId, new Map());
  }
  return memoryRepliedReviewsMap.get(businessId)!;
}

/**
 * Check if Upstash Redis or Vercel KV is configured via REST API
 */
function getUpstashConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) {
    return { url, token };
  }
  return null;
}

async function upstashCommand<T = unknown>(command: string, ...args: (string | number)[]): Promise<T | null> {
  const cfg = getUpstashConfig();
  if (!cfg) return null;

  try {
    const res = await fetch(`${cfg.url}/${command}/${args.map((a) => encodeURIComponent(String(a))).join("/")}`, {
      headers: {
        Authorization: `Bearer ${cfg.token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[Upstash] Error ${res.status}: ${res.statusText}`);
      return null;
    }
    const json = await res.json();
    return json.result as T;
  } catch (err) {
    console.error("[Upstash] Fetch failed:", err);
    return null;
  }
}

/**
 * Save Google OAuth tokens securely per business
 */
export async function saveGoogleTokens(tokens: GoogleTokens, businessId: string = "brijawasi"): Promise<void> {
  memoryTokensMap.set(businessId, tokens);

  const redisKey = `google_tokens_${businessId}`;

  // 1. Try Upstash / Vercel KV
  const cfg = getUpstashConfig();
  if (cfg) {
    try {
      await fetch(`${cfg.url}/set/${redisKey}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cfg.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(JSON.stringify(tokens)),
      });
      return;
    } catch (err) {
      console.error("[Storage] Upstash save error:", err);
    }
  }

  // 2. Try Local File System
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(getTokensFilePath(businessId), JSON.stringify(tokens, null, 2), "utf-8");
  } catch (err) {
    // Expected on read-only serverless filesystems without Redis
    console.warn("[Storage] Local file save failed (normal on Vercel without Upstash):", err);
  }
}

/**
 * Retrieve saved Google OAuth tokens per business
 */
export async function getGoogleTokens(businessId: string = "brijawasi"): Promise<GoogleTokens | null> {
  const redisKey = `google_tokens_${businessId}`;

  // 1. Try Upstash / Vercel KV
  const cfg = getUpstashConfig();
  if (cfg) {
    const res = await upstashCommand<string>("get", redisKey);
    if (res) {
      try {
        return typeof res === "string" ? JSON.parse(res) : res;
      } catch (err) {
        console.error("[Storage] Parse Upstash tokens error:", err);
      }
    }
  }

  // 2. Try Local File System
  try {
    const filePath = getTokensFilePath(businessId);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("[Storage] Local file read error:", err);
  }

  // 3. Fallback to Environment Variables
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN_BRIJAWASI || process.env.GOOGLE_REFRESH_TOKEN;
  const accountId = process.env.GOOGLE_ACCOUNT_ID_BRIJAWASI || process.env.GOOGLE_ACCOUNT_ID;
  const locationId = process.env.GOOGLE_LOCATION_ID_BRIJAWASI || process.env.GOOGLE_LOCATION_ID;

  if (refreshToken) {
    return {
      access_token: "",
      refresh_token: refreshToken,
      accountId,
      locationId,
      updatedAt: new Date().toISOString(),
    };
  }

  return memoryTokensMap.get(businessId) || null;
}

/**
 * Check if a review has already been replied to for a business
 */
export async function hasRepliedToReview(reviewId: string, businessId: string = "brijawasi"): Promise<boolean> {
  const memMap = getMemoryRepliedMap(businessId);
  if (memMap.has(reviewId)) {
    return true;
  }

  const setKey = `replied_review_ids_${businessId}`;

  // 1. Try Upstash / Vercel KV
  const cfg = getUpstashConfig();
  if (cfg) {
    const isMember = await upstashCommand<number>("sismember", setKey, reviewId);
    if (isMember === 1) return true;
  }

  // 2. Try Local File System
  try {
    const filePath = getRepliedReviewsFilePath(businessId);
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const list: RepliedReviewRecord[] = JSON.parse(data);
      return list.some((r) => r.reviewId === reviewId);
    }
  } catch {
    // Ignore error
  }

  return false;
}

/**
 * Record a successfully replied review to prevent duplicate replies per business
 */
export async function recordRepliedReview(record: RepliedReviewRecord, businessId: string = "brijawasi"): Promise<void> {
  const memMap = getMemoryRepliedMap(businessId);
  memMap.set(record.reviewId, record);

  const setKey = `replied_review_ids_${businessId}`;
  const hashKey = `replied_reviews_data_${businessId}`;

  // 1. Try Upstash / Vercel KV
  const cfg = getUpstashConfig();
  if (cfg) {
    try {
      await upstashCommand("sadd", setKey, record.reviewId);
      await fetch(`${cfg.url}/hset/${hashKey}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cfg.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([record.reviewId, JSON.stringify(record)]),
      });
      return;
    } catch (err) {
      console.error("[Storage] Upstash record error:", err);
    }
  }

  // 2. Try Local File System
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const filePath = getRepliedReviewsFilePath(businessId);
    let list: RepliedReviewRecord[] = [];
    if (fs.existsSync(filePath)) {
      try {
        list = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch {
        list = [];
      }
    }
    if (!list.some((r) => r.reviewId === record.reviewId)) {
      list.push(record);
      fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("[Storage] Local file record failed:", err);
  }
}

/**
 * Get all replied reviews for a business
 */
export async function getRepliedReviews(businessId: string = "brijawasi"): Promise<RepliedReviewRecord[]> {
  const hashKey = `replied_reviews_data_${businessId}`;

  const cfg = getUpstashConfig();
  if (cfg) {
    const rawData = await upstashCommand<Record<string, string>>("hgetall", hashKey);
    if (rawData && typeof rawData === "object") {
      try {
        return Object.values(rawData).map((val) => (typeof val === "string" ? JSON.parse(val) : val));
      } catch (err) {
        console.error("[Storage] Parse Upstash hash error:", err);
      }
    }
  }

  try {
    const filePath = getRepliedReviewsFilePath(businessId);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch {
    // Ignore
  }

  return Array.from(getMemoryRepliedMap(businessId).values());
}

// ----------------------------------------------------
// Recent Review Hashes (Best-effort repetition avoidance)
// ----------------------------------------------------
const RECENT_HASHES_FILE = path.join(DATA_DIR, "recent_review_hashes.json");
const memoryReviewHashes = new Set<string>();

export async function isRecentReviewHash(hash: string): Promise<boolean> {
  if (memoryReviewHashes.has(hash)) return true;

  const cfg = getUpstashConfig();
  if (cfg) {
    const exists = await upstashCommand<number>("sismember", "recent_review_hashes", hash);
    if (exists === 1) return true;
  }

  try {
    if (fs.existsSync(RECENT_HASHES_FILE)) {
      const list: string[] = JSON.parse(fs.readFileSync(RECENT_HASHES_FILE, "utf-8"));
      if (list.includes(hash)) return true;
    }
  } catch {
    // Ignore
  }
  return false;
}

export async function recordRecentReviewHashes(hashes: string[]): Promise<void> {
  if (!hashes || hashes.length === 0) return;

  hashes.forEach((h) => memoryReviewHashes.add(h));

  const cfg = getUpstashConfig();
  if (cfg) {
    for (const h of hashes) {
      await upstashCommand("sadd", "recent_review_hashes", h);
    }
    // Set 7-day TTL if possible
    await upstashCommand("expire", "recent_review_hashes", 60 * 60 * 24 * 7);
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    let list: string[] = [];
    if (fs.existsSync(RECENT_HASHES_FILE)) {
      try {
        list = JSON.parse(fs.readFileSync(RECENT_HASHES_FILE, "utf-8"));
      } catch {
        list = [];
      }
    }
    for (const h of hashes) {
      if (!list.includes(h)) list.push(h);
    }
    // Keep last 200 hashes max
    if (list.length > 200) list = list.slice(-200);
    fs.writeFileSync(RECENT_HASHES_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.warn("[Storage] Local review hashes save failed:", err);
  }
}


