import { NextRequest, NextResponse } from "next/server";
import { processAndReplyToReviews } from "@/lib/google-business";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Google Cloud Pub/Sub push payload validation
    // Format: { message: { data: "base64...", messageId: "..." }, subscription: "..." }
    let notificationData: Record<string, unknown> | null = null;
    if (body?.message?.data) {
      try {
        const decoded = Buffer.from(body.message.data, "base64").toString("utf-8");
        notificationData = JSON.parse(decoded);
      } catch (err) {
        console.warn("[Webhook] Non-JSON Pub/Sub payload:", err);
      }
    }

    console.log("[Webhook] Received Google Business Profile notification:", notificationData || body);

    // Synchronize and auto-reply to any pending reviews
    const result = await processAndReplyToReviews("webhook", "brijawasi");

    return NextResponse.json({
      received: true,
      syncResult: result,
    });
  } catch (err: unknown) {
    console.error("[Webhook Error]:", err);
    const msg = err instanceof Error ? err.message : String(err);
    // Return 200 to acknowledge Pub/Sub, while logging the error
    return NextResponse.json({ received: true, error: msg }, { status: 200 });
  }
}

