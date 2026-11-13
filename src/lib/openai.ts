import OpenAI from "openai";
import { isRecentReviewHash, recordRecentReviewHashes } from "./storage";

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_openai_api_key_here") {
    return null;
  }
  return new OpenAI({ apiKey });
}

export interface RestaurantReviewInput {
  businessName?: string;
  dishes?: string[];
  services?: string[];
  experiences?: string[];
  rating: number; // 1 to 5
  feedback?: string;
  language: "en" | "hi" | "hinglish";
}

// Backwards compatibility alias
export type SimplifiedReviewInput = RestaurantReviewInput;

export interface ReviewSuggestion {
  id: number;
  styleLabel: string;
  text: string;
}

export const RESTAURANT_STYLE_LABELS = [
  "Short & Simple",
  "Food Taste & Quality Focus",
  "Detailed Dining Experience",
  "Professional & Elegant",
  "Friendly & Conversational",
  "Natural Hindi / Hinglish",
];

function normalizeHash(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 48);
}

/**
 * Generate 6 distinct, restaurant-specialized review suggestions in a single OpenAI request.
 */
export async function generateRestaurantReviewSuggestions(
  input: RestaurantReviewInput
): Promise<{
  suggestions: ReviewSuggestion[];
  source: "openai" | "template";
}> {
  const openai = getOpenAIClient();
  const businessName = input.businessName || "Brajwasi Lucknow Special";
  const trimmedFeedback = (input.feedback || "").trim();

  const selectedDishes =
    input.dishes && input.dishes.length > 0 ? input.dishes : [];
  const selectedServices =
    input.services && input.services.length > 0 ? input.services : [];
  const selectedExperiences =
    input.experiences && input.experiences.length > 0 ? input.experiences : [];

  const dishesText =
    selectedDishes.length > 0
      ? selectedDishes.join(", ")
      : "Authentic Lucknowi food";
  const servicesText =
    selectedServices.length > 0
      ? selectedServices.join(", ")
      : "Restaurant dining";
  const experiencesText =
    selectedExperiences.length > 0
      ? selectedExperiences.join(", ")
      : "Delicious taste and warm hospitality";

  if (!openai) {
    return {
      suggestions: generateRestaurantFallbackSuggestions(input),
      source: "template",
    };
  }

  let languagePrompt = "Write reviews in natural, fluent English.";
  if (input.language === "hi") {
    languagePrompt =
      "Write reviews in natural Hindi script (Devanagari), except Style 6 which can be colloquial Hinglish.";
  } else if (input.language === "hinglish") {
    languagePrompt =
      "Write reviews in natural conversational Hinglish (Hindi written in Roman English alphabet).";
  }

  const prompt = `
You are generating 6 distinctly different Google review suggestions for a real customer of "${businessName}" restaurant.

Customer Verified Input:
- Specific Food/Dishes Ordered: ${dishesText}
- Services Used: ${servicesText}
- Specific What They Liked / Experiences: ${experiencesText}
- Star Rating: ${input.rating} out of 5 stars
- Customer's Own Notes: "${trimmedFeedback || "None provided (strictly base only on selected food and feedback)"}"
- Primary Language: ${languagePrompt}

Generate EXACTLY 6 distinct review options matching these styles:
1. "Short & Simple" — Concise, punchy, 1-2 natural sentences, authentic diner voice.
2. "Food Taste & Quality Focus" — Emphasizes flavor, freshness, authentic spices, paratha texture or biryani aroma.
3. "Detailed Dining Experience" — Comprehensive, mentions food, hospitality, clean dining space, or portion size.
4. "Professional & Elegant" — Well-spoken, courteous, articulate evaluation of dining and hospitality.
5. "Friendly & Conversational" — Warm, cheerful, relatable recommendation from a satisfied foodie.
6. "Natural Hindi / Hinglish" — Colloquial Indian dining phrasing (e.g. "Swad bilkul lajawab tha...", "Garma-garam paratha aur biryani ka maza hi alag hai...").

CRITICAL RESTAURANT AUTHENTICITY & ANTI-HALLUCINATION RULES:
- The authoritative restaurant menu ONLY includes: Veg Kabab Paratha, Veg Kabab Roll, Veg Biryani, Paneer Masala Roll, Veg Keema Roll, Paneer Kaleji Roll, Kathi Roll.
- NEVER mention prices, costs, rupee amounts, or pricing numbers anywhere in any review.
- Mention ONLY dishes the customer actually selected (${dishesText}). If no specific dish was selected, talk generally about the food/rolls/meal. NEVER invent unselected dishes (no dal, no thali, no aloo paratha, no paneer paratha, no drinks, no desserts).
- Mention ONLY services actually selected (${servicesText}).
- Weave in what they liked (${experiencesText}) naturally and smoothly.
- Strictly adhere to their star rating (${input.rating} of 5 stars). For 1-3 stars, keep it honest, polite, and constructive without being hostile. For 4-5 stars, make it appreciative and genuine.
- Every single review MUST have a completely different opening sentence and different vocabulary. Never start two reviews with the same words.
- No generic marketing fluff, fake discount claims, or repetitive closing slogans like "Must visit" in every review.
- Length: between 20 and 65 words per review.

Return ONLY a valid JSON object matching this schema:
{
  "suggestions": [
    { "id": 1, "styleLabel": "Short & Simple", "text": "..." },
    { "id": 2, "styleLabel": "Food Taste & Quality Focus", "text": "..." },
    { "id": 3, "styleLabel": "Detailed Dining Experience", "text": "..." },
    { "id": 4, "styleLabel": "Professional & Elegant", "text": "..." },
    { "id": 5, "styleLabel": "Friendly & Conversational", "text": "..." },
    { "id": 6, "styleLabel": "Natural Hindi / Hinglish", "text": "..." }
  ]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert culinary review generator that outputs strictly valid JSON containing 6 distinct, diverse restaurant customer reviews with zero repetition.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.82,
      max_tokens: 800,
    });

    const rawContent = response.choices[0]?.message?.content?.trim();
    if (rawContent) {
      const parsed = JSON.parse(rawContent);
      const list: ReviewSuggestion[] = Array.isArray(parsed.suggestions)
        ? parsed.suggestions
        : Array.isArray(parsed.reviews)
        ? parsed.reviews
        : [];

      if (list.length >= 6) {
        const seenInBatch = new Set<string>();
        const uniqueList: ReviewSuggestion[] = [];
        const fallbackList = generateRestaurantFallbackSuggestions(input);

        for (let i = 0; i < 6; i++) {
          const item = list[i];
          const text = (item?.text || "").trim().replace(/^["']|["']$/g, "");
          const hash = normalizeHash(text);

          const isDupInBatch = seenInBatch.has(hash);
          let isRecent = false;
          try {
            isRecent = await isRecentReviewHash(hash);
          } catch {
            isRecent = false;
          }

          if (text.length > 15 && !isDupInBatch && !isRecent) {
            seenInBatch.add(hash);
            uniqueList.push({
              id: i + 1,
              styleLabel: item.styleLabel || RESTAURANT_STYLE_LABELS[i],
              text,
            });
          } else {
            const replacement = fallbackList[i]?.text || text;
            const repHash = normalizeHash(replacement);
            seenInBatch.add(repHash);
            uniqueList.push({
              id: i + 1,
              styleLabel: RESTAURANT_STYLE_LABELS[i],
              text: replacement,
            });
          }
        }

        if (uniqueList.length === 6) {
          try {
            const hashes = uniqueList.map((u) => normalizeHash(u.text));
            await recordRecentReviewHashes(hashes);
          } catch (e) {
            console.warn("[Storage] Failed to record recent review hashes:", e);
          }

          return { suggestions: uniqueList, source: "openai" };
        }
      }
    }
  } catch (err) {
    console.error("[OpenAI] Restaurant suggestions generation error:", err);
  }

  return {
    suggestions: generateRestaurantFallbackSuggestions(input),
    source: "template",
  };
}

/**
 * 6 Diverse Fallback Suggestions for Restaurant when OpenAI API is offline
 */
export function generateRestaurantFallbackSuggestions(
  input: RestaurantReviewInput
): ReviewSuggestion[] {
  const businessName = input.businessName || "Brajwasi Lucknow Special";
  const dishes =
    input.dishes && input.dishes.length > 0
      ? input.dishes
      : ["Authentic Lucknowi Food"];
  const services =
    input.services && input.services.length > 0
      ? input.services
      : ["Dine-In"];
  const experiences = input.experiences || [];

  const dishStr = dishes.slice(0, 2).join(" & ");
  const serviceStr = services[0] || "dining";
  const note = (input.feedback || "").trim();
  const rating = input.rating || 5;
  const isPositive = rating >= 4;

  const expEn =
    experiences.length > 0
      ? `Particularly liked their ${experiences.slice(0, 2).join(" and ").toLowerCase()}.`
      : "The freshness and spice blend were spot on.";
  const expHi =
    experiences.length > 0
      ? `खास तौर पर इनकी ${experiences.slice(0, 2).join(" व ")} बहुत पसंद आई।`
      : "स्वाद और ताजगी वाकई लाजवाब थी।";
  const expHinglish =
    experiences.length > 0
      ? `Specially inki ${experiences.slice(0, 2).join(" aur ")} bohot achhi lagi.`
      : "Khana bilkul fresh aur taste ek number tha.";

  if (input.language === "hi") {
    if (isPositive) {
      return [
        {
          id: 1,
          styleLabel: "Short & Simple",
          text: `${businessName} में ${dishStr} खाया। स्वाद एकदम लाजवाब और सेवा बहुत त्वरित थी।`,
        },
        {
          id: 2,
          styleLabel: "Food Taste & Quality Focus",
          text: `स्वाद के शौकीनों के लिए ${businessName} बेहतरीन जगह है। ${dishStr} का स्वाद और मसालों का संतुलन एकदम सटीक रहा। ${expHi}`,
        },
        {
          id: 3,
          styleLabel: "Detailed Dining Experience",
          text: `परिवार के साथ ${businessName} में ${serviceStr} का शानदार अनुभव रहा। ${dishStr} गरमा-गरम परोसा गया। ${expHi} ${note ? `${note}। ` : ""}सफाई और बैठक व्यवस्था भी बहुत अच्छी है।`,
        },
        {
          id: 4,
          styleLabel: "Professional & Elegant",
          text: `${businessName} में लखनवी आतिथ्य और गुणवत्तापूर्ण शाकाहारी भोजन का उत्तम अनुभव मिला। ${dishStr} की प्रस्तुति और स्टाफ का शिष्टाचार सराहनीय है।`,
        },
        {
          id: 5,
          styleLabel: "Friendly & Conversational",
          text: `बहुत ही प्यारा अनुभव रहा! ${dishStr} खाकर दिल खुश हो गया। ${expHi} ${note ? `${note}। ` : ""}स्टाफ बहुत विनम्र है, दोबारा जरूर आएंगे।`,
        },
        {
          id: 6,
          styleLabel: "Natural Hindi / Hinglish",
          text: `${businessName} ka swad sach me lajawab hai! ${dishStr} order kiya tha, maza aa gaya. ${expHinglish} Family ke sath dining ke liye best spot.`,
        },
      ];
    } else {
      return [
        {
          id: 1,
          styleLabel: "Short & Simple",
          text: `${businessName} से ${dishStr} लिया। अनुभव सामान्य रहा।`,
        },
        {
          id: 2,
          styleLabel: "Food Taste & Quality Focus",
          text: `${dishStr} का स्वाद औसत था। मसालों और ताजगी में सुधार की गुंजाइश है।`,
        },
        {
          id: 3,
          styleLabel: "Detailed Dining Experience",
          text: `${businessName} में ${serviceStr} का अनुभव मिला-जुला रहा। ${note ? `${note}। ` : ""}सर्विस और तैयारी पर थोड़ा और ध्यान देने की आवश्यकता है।`,
        },
        {
          id: 4,
          styleLabel: "Professional & Elegant",
          text: `${businessName} को निष्पक्ष फीडबैक: ${dishStr} की गुणवत्ता ठीक-ठाक थी, परंतु सेवा की निरंतरता बेहतर की जा सकती है।`,
        },
        {
          id: 5,
          styleLabel: "Friendly & Conversational",
          text: `स्टाफ विनम्र था लेकिन ${dishStr} का स्वाद उम्मीद से थोड़ा कम रहा। आशा है आगे सुधार होगा।`,
        },
        {
          id: 6,
          styleLabel: "Natural Hindi / Hinglish",
          text: `${businessName} me ${dishStr} try kiya tha. Average experience raha, taste aur better ho sakta hai.`,
        },
      ];
    }
  }

  if (input.language === "hinglish") {
    if (isPositive) {
      return [
        {
          id: 1,
          styleLabel: "Short & Simple",
          text: `${businessName} me ${dishStr} khaya. Superb taste aur quick service! Totally satisfied.`,
        },
        {
          id: 2,
          styleLabel: "Food Taste & Quality Focus",
          text: `${dishStr} ka authentic Lucknowi flavor sach me lajawab tha. Freshly prepared aur spices ka balance bilkul perfect tha. ${expHinglish}`,
        },
        {
          id: 3,
          styleLabel: "Detailed Dining Experience",
          text: `Had a wonderful ${serviceStr} experience at ${businessName}. ${dishStr} was hot and delicious. ${expHinglish} ${note ? `${note}. ` : ""}Seating area was neat and welcoming.`,
        },
        {
          id: 4,
          styleLabel: "Professional & Elegant",
          text: `Prompt hospitality and quality food at ${businessName}. The preparation of ${dishStr} reflects royal authentic culinary care.`,
        },
        {
          id: 5,
          styleLabel: "Friendly & Conversational",
          text: `Bohot hi maza aaya yahan khana kha kar! ${dishStr} was delicious. ${expHinglish} ${note ? `${note}. ` : ""}Staff bohot polite aur helpful hai.`,
        },
        {
          id: 6,
          styleLabel: "Natural Hindi / Hinglish",
          text: `${businessName} Lucknow Special me ${dishStr} try kiya. Swad ek number! Portions bhi ache the aur ambience peaceful hai.`,
        },
      ];
    } else {
      return [
        {
          id: 1,
          styleLabel: "Short & Simple",
          text: `Tried ${dishStr} at ${businessName}. Experience was average.`,
        },
        {
          id: 2,
          styleLabel: "Food Taste & Quality Focus",
          text: `${dishStr} was okay, but expected richer flavors and better spice balance.`,
        },
        {
          id: 3,
          styleLabel: "Detailed Dining Experience",
          text: `Mixed experience with ${serviceStr} at ${businessName}. ${note ? `${note}. ` : ""}Service time could be improved.`,
        },
        {
          id: 4,
          styleLabel: "Professional & Elegant",
          text: `Constructive feedback for ${businessName}: The ${dishStr} was decent, but quality control can be elevated.`,
        },
        {
          id: 5,
          styleLabel: "Friendly & Conversational",
          text: `Staff was courteous, but ${dishStr} didn't quite match expectations this time. Hope it improves.`,
        },
        {
          id: 6,
          styleLabel: "Natural Hindi / Hinglish",
          text: `${businessName} me ${dishStr} order kiya tha. Thoda average laga, preparation can be better.`,
        },
      ];
    }
  }

  // English fallback
  if (isPositive) {
    return [
      {
        id: 1,
        styleLabel: "Short & Simple",
        text: `Dined at ${businessName} and tried their ${dishStr}. Authentic taste, fast service, and generous portion!`,
      },
      {
        id: 2,
        styleLabel: "Food Taste & Quality Focus",
        text: `Outstanding culinary authenticity at ${businessName}. The ${dishStr} was freshly prepared with incredible aroma and balanced spices. ${expEn}`,
      },
      {
        id: 3,
        styleLabel: "Detailed Dining Experience",
        text: `Delightful ${serviceStr} experience at ${businessName}. ${dishStr} was served steaming hot. ${expEn} ${note ? `${note}. ` : ""}Clean seating, polite staff, and great hospitality.`,
      },
      {
        id: 4,
        styleLabel: "Professional & Elegant",
        text: `${businessName} upholds refined standards of Lucknowi vegetarian culinary hospitality. The preparation of ${dishStr} and courteous customer care were exemplary.`,
      },
      {
        id: 5,
        styleLabel: "Friendly & Conversational",
        text: `Such a comforting dining experience! Loved their ${dishStr}. ${expEn} ${note ? `${note}. ` : ""}The team made us feel right at home. Will definitely visit again!`,
      },
      {
        id: 6,
        styleLabel: "Natural Hindi / Hinglish",
        text: `${businessName} ka swad sach me lajawab hai! Ordered ${dishStr} and the quality was top-notch. Truly authentic Lucknowi dining.`,
      },
    ];
  } else {
    return [
      {
        id: 1,
        styleLabel: "Short & Simple",
        text: `Tried ${dishStr} at ${businessName}. The experience was average with scope for improvement.`,
      },
      {
        id: 2,
        styleLabel: "Food Taste & Quality Focus",
        text: `The taste of ${dishStr} was satisfactory, though we expected more authentic seasoning and warmth.`,
      },
      {
        id: 3,
        styleLabel: "Detailed Dining Experience",
        text: `Visited ${businessName} for ${serviceStr}. ${note ? `${note}. ` : ""}The food was okay, but service pacing could be sharper.`,
      },
      {
        id: 4,
        styleLabel: "Professional & Elegant",
        text: `Constructive review regarding our recent order of ${dishStr} at ${businessName}. Expecting more consistency in preparation.`,
      },
      {
        id: 5,
        styleLabel: "Friendly & Conversational",
        text: `The team was polite, but ${dishStr} did not completely hit the mark today. Hope to see finer attention to details.`,
      },
      {
        id: 6,
        styleLabel: "Natural Hindi / Hinglish",
        text: `${businessName} me ${dishStr} try kiya. Average experience raha, hope quality will be refined.`,
      },
    ];
  }
}

/**
 * Aliases for backwards compatibility - always routes to restaurant generator
 */
export const generateCustomerReviewSuggestions = generateRestaurantReviewSuggestions;
export const generateCustomerReview = async (input: RestaurantReviewInput) => {
  const res = await generateRestaurantReviewSuggestions(input);
  return {
    review: res.suggestions[0]?.text || "",
    source: res.source,
  };
};

/**
 * Generate an official restaurant owner reply for Brajwasi Lucknow Special
 */
export async function generateRestaurantOwnerReply(
  review: {
    reviewerName: string;
    starRating: number;
    comment?: string;
  },
  restaurantName = "Brajwasi Lucknow Special"
): Promise<string> {
  const openai = getOpenAIClient();

  if (!openai) {
    return generateFallbackRestaurantOwnerReply(review, restaurantName);
  }

  const prompt = `
You are the owner and host of "${restaurantName}", a respected restaurant specializing in authentic Lucknowi taste, veg biryani, parathas, and traditional hospitality.

Customer review details:
- Reviewer: ${review.reviewerName || "Valued Guest"}
- Rating: ${review.starRating} out of 5 stars
- Review comment: "${review.comment || "(No text comment left, rating only)"}"

Reply Guidelines:
1. For Positive reviews (4-5 stars):
   - Warmly and respectfully thank them by name.
   - Mention the food, veg biryani, parathas, or dining experience if they touched upon it.
   - Express joy in serving authentic Lucknowi flavors and welcome them back.

2. For Neutral reviews (3 stars):
   - Courteous and appreciative tone.
   - Thank them for dining with us and sharing helpful feedback.
   - Acknowledge their comments and assure them that their feedback helps refine our recipes and service.

3. For Negative reviews (1-2 stars):
   - Sincere, humble apology for not meeting their expectations.
   - Acknowledge their specific concern (taste, service, delivery, or freshness) without defensiveness.
   - Invite them to contact the restaurant manager directly so we can personally make things right.

Language & Authenticity Rules:
- Reply in the EXACT same language as the customer's comment:
  - If review is in English -> reply in fluent English.
  - If review is in Hindi script -> reply in polite, warm Hindi (Devanagari).
  - If review is in Hinglish -> reply in respectful Hinglish.
  - If no text is provided, reply in polite English.
- NEVER invent discounts, free food, or false claims.
- Keep concise (30 to 60 words).
- Sign off naturally as "Team ${restaurantName}".
- Return ONLY the reply text.
`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are the hospitable owner of ${restaurantName} replying to Google Reviews.`,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 180,
    });

    const reply = response.choices[0]?.message?.content?.trim();
    if (reply) {
      return reply.replace(/^["']|["']$/g, "");
    }
  } catch (err) {
    console.error("[OpenAI] Restaurant owner reply error:", err);
  }

  return generateFallbackRestaurantOwnerReply(review, restaurantName);
}

// Alias for owner reply
export const generateOwnerReply = generateRestaurantOwnerReply;

function generateFallbackRestaurantOwnerReply(
  review: {
    reviewerName: string;
    starRating: number;
    comment?: string;
  },
  restaurantName = "Brajwasi Lucknow Special"
): string {
  const name = review.reviewerName ? review.reviewerName.split(" ")[0] : "Guest";
  const comment = (review.comment || "").toLowerCase();

  const isHindi = /[\u0900-\u097F]/.test(comment);
  const isHinglish =
    /\b(bhai|bohot|achha|accha|swad|khana|biryani|paratha|dhanyawad|dhanyavad|lajawab)\b/i.test(comment);

  if (isHindi) {
    if (review.starRating >= 4) {
      return `नमस्ते ${name} जी! ${restaurantName} में पधारने और अपना अनुभव साझा करने के लिए बहुत-बहुत धन्यवाद। आपको हमारा लखनवी स्वाद पसंद आया, यह जानकर हमें अत्यंत प्रसन्नता हुई। फिर पधारें! - टीम ${restaurantName}`;
    } else {
      return `नमस्ते ${name} जी, आपके फीडबैक के लिए धन्यवाद। आपको हुई किसी भी असुविधा के लिए हम क्षमा चाहते हैं। कृपया रेस्तरां प्रबंधन से संपर्क करें ताकि हम आपकी सेवा में तुरंत सुधार कर सकें। - टीम ${restaurantName}`;
    }
  }

  if (isHinglish) {
    if (review.starRating >= 4) {
      return `Thank you so much ${name} ji! ${restaurantName} me visit karne aur itna pyara review dene ke liye shukriya. Authentic Lucknowi swad serve karna hamari khushi hai. Looking forward to welcoming you again! - Team ${restaurantName}`;
    } else {
      return `Hello ${name} ji, feedback ke liye dhanyawad. Aapko hui asuvidha ke liye hum sincerely apologize karte hain. Please restaurant manager se connect karein taaki hum experience improve kar sakein. - Team ${restaurantName}`;
    }
  }

  // English fallback
  if (review.starRating >= 4) {
    return `Thank you for dining with us at ${restaurantName}, ${name}! We are thrilled that you enjoyed our authentic food and hospitality. We look forward to welcoming you back soon! - Team ${restaurantName}`;
  } else if (review.starRating === 3) {
    return `Thank you for sharing your feedback, ${name}. We appreciate your visit and have noted your valuable points to continuously improve our food and dining service. - Team ${restaurantName}`;
  } else {
    return `Dear ${name}, thank you for bringing this to our attention. We sincerely apologize that your dining experience did not meet our high culinary standards. Please reach out to our management directly so we can resolve this for you. - Team ${restaurantName}`;
  }
}
