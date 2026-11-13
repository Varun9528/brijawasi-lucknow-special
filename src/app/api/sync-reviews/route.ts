import { NextRequest, NextResponse } from "next/server";
import { processAndReplyToReviews } from "@/lib/google-business";

export async function GET(req: NextRequest) {
  return handleSync(req);
}

export async function POST(req: NextRequest) {
  return handleSync(req);
}

async function handleSync(req: NextRequest) {
  // If CRON_SECRET is configured, enforce security
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized. Invalid CRON_SECRET." }, { status: 401 });
    }
  }

  try {
    const businessId = req.nextUrl.searchParams.get("businessId") || "brijawasi";
    const result = await processAndReplyToReviews("cron", businessId);
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      businessId,
      ...result,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        success: false,
        error: msg,
      },
      { status: 500 }
    );
  }
}

