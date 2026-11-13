import { NextRequest, NextResponse } from "next/server";
import {
  generateRestaurantReviewSuggestions,
  RestaurantReviewInput,
} from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const rating = Number(body.rating);
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Please select a star rating (1 to 5 stars)." },
        { status: 400 }
      );
    }

    const language = ["en", "hi", "hinglish"].includes(body.language)
      ? (body.language as "en" | "hi" | "hinglish")
      : "en";

    const feedback = typeof body.feedback === "string" ? body.feedback.trim() : "";

    const dishes = Array.isArray(body.dishes)
      ? body.dishes.filter((d: unknown) => typeof d === "string" && d.trim().length > 0)
      : [];

    const services = Array.isArray(body.services)
      ? body.services.filter((s: unknown) => typeof s === "string" && s.trim().length > 0)
      : [];

    const experiences = Array.isArray(body.experiences)
      ? body.experiences.filter((e: unknown) => typeof e === "string" && e.trim().length > 0)
      : [];

    const restaurantInput: RestaurantReviewInput = {
      businessName: body.businessName || "Brijawasi Lucknow Special",
      dishes,
      services,
      experiences,
      rating,
      feedback,
      language,
    };

    const result = await generateRestaurantReviewSuggestions(restaurantInput);

    return NextResponse.json({
      success: true,
      suggestions: result.suggestions,
      review: result.suggestions[0]?.text || "",
      source: result.source,
    });
  } catch (err: unknown) {
    console.error("[API generate-review] Error:", err);
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
