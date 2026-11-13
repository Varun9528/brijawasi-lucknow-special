import { NextRequest, NextResponse } from "next/server";
import { getGoogleIntegrationStatus } from "@/lib/google-business";

export async function GET(req: NextRequest) {
  try {
    const businessId = req.nextUrl.searchParams.get("businessId") || "brijawasi";
    const status = await getGoogleIntegrationStatus(businessId);
    return NextResponse.json({
      success: true,
      businessId,
      timestamp: new Date().toISOString(),
      status,
      guide: {
        oauthConnectUrl: `/api/google/oauth?businessId=${businessId}`,
        syncReviewsUrl: `/api/sync-reviews?businessId=${businessId}`,
        webhookUrl: "/api/google/webhook",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

