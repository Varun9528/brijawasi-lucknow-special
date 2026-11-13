export interface RestaurantServiceItem {
  id: string;
  name: string;
  nameHindi: string;
}

export interface RestaurantMenuItem {
  id: string;
  name: string;
  nameHindi: string;
}

export interface RestaurantExperienceItem {
  id: string;
  name: string;
  nameHindi: string;
  category: "food_quality" | "food_experience" | "service" | "restaurant_experience";
}

export interface RestaurantExperienceCategory {
  key: "food_quality" | "food_experience" | "service" | "restaurant_experience";
  title: string;
  titleHindi: string;
  items: RestaurantExperienceItem[];
}

export const BRIJAWASI_SERVICES: RestaurantServiceItem[] = [
  { id: "dine-in", name: "Dine-In", nameHindi: "डाइन-इन (बैठकर भोजन)" },
  { id: "takeaway", name: "Takeaway", nameHindi: "टेकअवे (पैक कराएं)" },
  { id: "food-delivery", name: "Food Delivery", nameHindi: "फूड डिलीवरी" },
  { id: "family-dining", name: "Family Dining", nameHindi: "फैमिली डाइनिंग" },
  { id: "online-order", name: "Online Order", nameHindi: "ऑनलाइन ऑर्डर" },
  { id: "party-group", name: "Party / Group Order", nameHindi: "पार्टी व ग्रुप ऑर्डर" },
  { id: "other-service", name: "Other", nameHindi: "अन्य" },
];

/**
 * EXACT AUTHORITATIVE MENU FROM RESTAURANT POSTER:
 * 1. Veg Kabab Paratha
 * 2. Veg Kabab Roll
 * 3. Veg Biryani
 * 4. Paneer Masala Roll
 * 5. Veg Keema Roll
 * 6. Paneer Kaleji Roll
 * 7. Kathi Roll
 * + Other (custom dish typed by customer)
 * STRICT RULE: No prices displayed anywhere in customer interface.
 */
export const BRIJAWASI_MENU_ITEMS: RestaurantMenuItem[] = [
  { id: "veg-kabab-paratha", name: "Veg Kabab Paratha", nameHindi: "वेज कबाब परांठा" },
  { id: "veg-kabab-roll", name: "Veg Kabab Roll", nameHindi: "वेज कबाब रोल" },
  { id: "veg-biryani", name: "Veg Biryani", nameHindi: "वेज बिरयानी" },
  { id: "paneer-masala-roll", name: "Paneer Masala Roll", nameHindi: "पनीर मसाला रोल" },
  { id: "veg-keema-roll", name: "Veg Keema Roll", nameHindi: "वेज कीमा रोल" },
  { id: "paneer-kaleji-roll", name: "Paneer Kaleji Roll", nameHindi: "पनीर कलेजी रोल" },
  { id: "kathi-roll", name: "Kathi Roll", nameHindi: "काठी रोल" },
  { id: "other-dish", name: "Other", nameHindi: "अन्य डिश" },
];

export const BRIJAWASI_EXPERIENCE_CATEGORIES: RestaurantExperienceCategory[] = [
  {
    key: "food_quality",
    title: "Food Quality",
    titleHindi: "भोजन की गुणवत्ता",
    items: [
      { id: "delicious-taste", name: "Delicious Taste", nameHindi: "लाजवाब स्वाद", category: "food_quality" },
      { id: "freshly-prepared", name: "Freshly Prepared Food", nameHindi: "ताजा बना गर्म भोजन", category: "food_quality" },
      { id: "authentic-flavours", name: "Authentic Flavours", nameHindi: "असली लखनवी स्वाद", category: "food_quality" },
      { id: "perfectly-cooked", name: "Perfectly Cooked", nameHindi: "उत्तम तरीके से पका हुआ", category: "food_quality" },
      { id: "good-spice-balance", name: "Good Spice Balance", nameHindi: "मसालों का सही संतुलन", category: "food_quality" },
      { id: "generous-portion", name: "Generous Portion", nameHindi: "भरपूर मात्रा", category: "food_quality" },
    ],
  },
  {
    key: "food_experience",
    title: "Food Experience",
    titleHindi: "खाने का अनुभव",
    items: [
      { id: "crispy-soft-roll", name: "Crispy & Soft Roll", nameHindi: "कुरकुरा व स्वादिष्ट रोल", category: "food_experience" },
      { id: "flavourful-biryani", name: "Flavourful Veg Biryani", nameHindi: "खुशबूदार वेज बिरयानी", category: "food_experience" },
      { id: "tasty-kabab-paratha", name: "Mouthwatering Kabab Paratha", nameHindi: "स्वादिष्ट कबाब परांठा", category: "food_experience" },
      { id: "rich-filling", name: "Rich & Delicious Stuffing", nameHindi: "भरपूर व स्वादिष्ट भरावन", category: "food_experience" },
      { id: "quality-freshness", name: "Quality and Freshness", nameHindi: "क्वालिटी व ताजगी", category: "food_experience" },
    ],
  },
  {
    key: "service",
    title: "Service",
    titleHindi: "सेवा व स्टाफ",
    items: [
      { id: "friendly-staff", name: "Friendly Staff", nameHindi: "मिलनसार स्टाफ", category: "service" },
      { id: "quick-service", name: "Quick Service", nameHindi: "तेज सेवा", category: "service" },
      { id: "polite-behaviour", name: "Polite Behaviour", nameHindi: "विनम्र व्यवहार", category: "service" },
      { id: "helpful-staff", name: "Helpful Staff", nameHindi: "मददगार स्टाफ", category: "service" },
      { id: "good-communication", name: "Good Communication", nameHindi: "स्पष्ट बातचीत", category: "service" },
    ],
  },
  {
    key: "restaurant_experience",
    title: "Restaurant Experience",
    titleHindi: "माहौल व व्यवस्था",
    items: [
      { id: "clean-dining-area", name: "Clean Dining Area", nameHindi: "साफ-सुथरा भोजन क्षेत्र", category: "restaurant_experience" },
      { id: "comfortable-seating", name: "Comfortable Seating", nameHindi: "आरामदायक बैठक", category: "restaurant_experience" },
      { id: "family-friendly", name: "Family Friendly", nameHindi: "पारिवारिक माहौल", category: "restaurant_experience" },
      { id: "value-for-money", name: "Good Value for Money", nameHindi: "किफायती व पैसा वसूल", category: "restaurant_experience" },
      { id: "hygienic-environment", name: "Hygienic Environment", nameHindi: "स्वच्छ व हाइजीनिक वातावरण", category: "restaurant_experience" },
      { id: "overall-good", name: "Overall Good Experience", nameHindi: "शानदार कुल अनुभव", category: "restaurant_experience" },
    ],
  },
];

/**
 * Validates whether a URL is an official direct Google Review composer link
 * (e.g., https://g.page/r/.../review or https://search.google.com/local/writereview?placeid=...)
 * and rejects generic search URLs or empty values.
 */
export function isOfficialGoogleReviewUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith("https://") && !trimmed.startsWith("http://")) return false;
  // Strictly reject generic maps search URLs or unverified query searches
  if (
    trimmed.includes("maps/search/?api=1") ||
    trimmed.includes("maps/search?api=1") ||
    trimmed.includes("google.com/search?")
  ) {
    return false;
  }
  return true;
}

export const BRAJWASI_CONFIG = {
  id: "brajwasi",
  name: "Brajwasi Lucknow Special",
  category: "Restaurant",
  tagline: "Authentic Taste. Royal Experience.",
  permanentSlug: "/",
  alternateSlugs: ["/brajwasi", "/brijawasi", "/brijawasi-lucknow-special", "/review"],
  logoUrl: "/brijwasi-logo.jpg",
  // Official verified Brajwasi Google Review Composer destination (opens direct 5-star rating composer)
  googleReviewUrl:
    process.env.NEXT_PUBLIC_BRAJWASI_GOOGLE_REVIEW_URL?.trim() ||
    process.env.NEXT_PUBLIC_BRIJAWASI_GOOGLE_REVIEW_URL?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL?.trim() ||
    "https://search.google.com/local/writereview?placeid=ChIJEbF7jDb9YjkRfIojaE0GYYc",
  googleMapsUrl: "https://maps.app.goo.gl/VYXw86Ni7tEKEzxj8",
  googlePlaceId: "ChIJEbF7jDb9YjkRfIojaE0GYYc",
  // Official Instagram link
  instagramUrl: "https://www.instagram.com/brajwasilucknow?exln=eDgxMHZpamt0a2I5",
  // Brand color palette: Royal Maroon, Deep Burgundy, Antique Gold, Warm Cream, Ivory, Dark Brown
  brandColors: {
    royalMaroon: "#701C22",
    deepBurgundy: "#3B1118",
    antiqueGold: "#C9A24A",
    warmCream: "#FFF3DB",
    ivory: "#FFF9EF",
    darkBrown: "#342019",
  },
  observedListingReference: {
    rating: "5.0",
    reviews: "40+",
    address: "26-A, MR 9 Road, opposite Sudha Collection, Chandra Nagar, Indore",
  },
};

export const BRAJWASI_SERVICES = BRIJAWASI_SERVICES;
export const BRAJWASI_MENU_ITEMS = BRIJAWASI_MENU_ITEMS;
export const BRAJWASI_EXPERIENCE_CATEGORIES = BRIJAWASI_EXPERIENCE_CATEGORIES;

// Backwards compatibility aliases
export const BRIJAWASI_CONFIG = BRAJWASI_CONFIG;
export const ALL_SERVICES = BRAJWASI_SERVICES;
export const BUSINESS_CONFIG = BRAJWASI_CONFIG;
