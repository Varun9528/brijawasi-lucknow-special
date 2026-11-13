"use client";

import React, { useState, useEffect, useId, useRef } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import {
  Star,
  Copy,
  ExternalLink,
  QrCode,
  RefreshCw,
  Sparkles,
  ClipboardPaste,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
  HeartHandshake,
  Store,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Check,
  Info,
  CheckCircle2,
} from "lucide-react";
import {
  BRIJAWASI_SERVICES,
  BRIJAWASI_MENU_ITEMS,
  BRIJAWASI_EXPERIENCE_CATEGORIES,
  BRIJAWASI_CONFIG,
} from "@/lib/brijawasi-data";
import { ReviewSuggestion } from "@/lib/openai";
import FoodOpeningAnimation from "./FoodOpeningAnimation";
import BrijawasiTableCardPrintable from "./BrijawasiTableCardPrintable";
import BrajwasiLandingPage from "./BrajwasiLandingPage";

type Language = "en" | "hi" | "hinglish";

// ============================================================================
// CULINARY ILLUSTRATED BADGES FOR THE AUTHORITATIVE 7 DISHES (+ OTHER)
// ============================================================================
function DishIllustratedIcon({ dishId }: { dishId: string }) {
  switch (dishId) {
    case "veg-kabab-paratha":
      return (
        <svg viewBox="0 0 40 40" className="w-7 h-7 shrink-0" fill="none">
          <circle cx="20" cy="20" r="18" fill="#5A151B" stroke="#C9A24C" strokeWidth="1.2" />
          <ellipse cx="20" cy="20" rx="12" ry="9" fill="#D99A36" stroke="#BD7A22" strokeWidth="1" />
          <path d="M12 20 Q20 16 28 20" stroke="#7B3A0E" strokeWidth="1.2" strokeDasharray="2 2" />
          <circle cx="16" cy="19" r="2.2" fill="#701C22" />
          <circle cx="24" cy="21" r="2.2" fill="#701C22" />
        </svg>
      );
    case "veg-kabab-roll":
      return (
        <svg viewBox="0 0 40 40" className="w-7 h-7 shrink-0" fill="none">
          <circle cx="20" cy="20" r="18" fill="#5A151B" stroke="#C9A24C" strokeWidth="1.2" />
          <rect x="9" y="15" width="22" height="10" rx="4" transform="rotate(-15 20 20)" fill="#E5BA58" stroke="#BD7A22" strokeWidth="1" />
          <line x1="14" y1="13" x2="16" y2="25" stroke="#7B3A0E" strokeWidth="1.2" />
          <line x1="20" y1="12" x2="22" y2="24" stroke="#7B3A0E" strokeWidth="1.2" />
          <line x1="26" y1="11" x2="28" y2="23" stroke="#7B3A0E" strokeWidth="1.2" />
        </svg>
      );
    case "veg-biryani":
      return (
        <svg viewBox="0 0 40 40" className="w-7 h-7 shrink-0" fill="none">
          <circle cx="20" cy="20" r="18" fill="#5A151B" stroke="#C9A24C" strokeWidth="1.2" />
          <path d="M11 21 C11 28, 15 31, 20 31 C25 31, 29 28, 29 21 C29 17, 26 16, 23 15 L17 15 C14 16, 11 17, 11 21 Z" fill="#9C4C1C" stroke="#C9A24A" strokeWidth="1" />
          <ellipse cx="20" cy="16" rx="7" ry="2.5" fill="#FFF3DB" stroke="#C9A24A" strokeWidth="0.8" />
          <path d="M18 11 Q19 9 19 7 M22 11 Q23 9 23 7" stroke="#FFF9EF" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
        </svg>
      );
    case "paneer-masala-roll":
      return (
        <svg viewBox="0 0 40 40" className="w-7 h-7 shrink-0" fill="none">
          <circle cx="20" cy="20" r="18" fill="#5A151B" stroke="#C9A24C" strokeWidth="1.2" />
          <rect x="9" y="14" width="22" height="11" rx="5" transform="rotate(20 20 20)" fill="#E8A838" stroke="#BD7A22" strokeWidth="1" />
          <rect x="15" y="17" width="4.5" height="4.5" rx="1" fill="#FFF9EF" stroke="#BD7A22" strokeWidth="0.8" />
          <rect x="22" y="19" width="4" height="4" rx="0.8" fill="#FFF9EF" stroke="#BD7A22" strokeWidth="0.8" />
        </svg>
      );
    case "veg-keema-roll":
      return (
        <svg viewBox="0 0 40 40" className="w-7 h-7 shrink-0" fill="none">
          <circle cx="20" cy="20" r="18" fill="#5A151B" stroke="#C9A24C" strokeWidth="1.2" />
          <rect x="9" y="15" width="22" height="10" rx="4" transform="rotate(-10 20 20)" fill="#D99A36" stroke="#BD7A22" strokeWidth="1" />
          <circle cx="15" cy="19" r="1.5" fill="#701C22" />
          <circle cx="20" cy="21" r="1.5" fill="#701C22" />
          <circle cx="25" cy="19" r="1.5" fill="#701C22" />
        </svg>
      );
    case "paneer-kaleji-roll":
      return (
        <svg viewBox="0 0 40 40" className="w-7 h-7 shrink-0" fill="none">
          <circle cx="20" cy="20" r="18" fill="#5A151B" stroke="#C9A24C" strokeWidth="1.2" />
          <rect x="10" y="15" width="20" height="10" rx="4" transform="rotate(15 20 20)" fill="#C9A24A" stroke="#701C22" strokeWidth="1.2" />
          <circle cx="16" cy="20" r="2.2" fill="#701C22" />
          <rect x="21" y="18" width="4" height="4" rx="1" fill="#FFF9EF" />
        </svg>
      );
    case "kathi-roll":
      return (
        <svg viewBox="0 0 40 40" className="w-7 h-7 shrink-0" fill="none">
          <circle cx="20" cy="20" r="18" fill="#5A151B" stroke="#C9A24C" strokeWidth="1.2" />
          <path d="M12 26 L24 13 C26 11, 29 14, 27 16 L15 29 Z" fill="#E8A838" stroke="#BD7A22" strokeWidth="1.2" />
          <line x1="16" y1="21" x2="23" y2="15" stroke="#701C22" strokeWidth="1.4" />
          <line x1="14" y1="24" x2="21" y2="18" stroke="#701C22" strokeWidth="1.4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 40 40" className="w-7 h-7 shrink-0" fill="none">
          <circle cx="20" cy="20" r="18" fill="#5A151B" stroke="#C9A24C" strokeWidth="1.2" />
          <path d="M15 20 L25 20 M20 15 L20 25" stroke="#C9A24A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
  }
}

// ============================================================================
// ELEGANT AWADHI ROYAL GOLD DIVIDER
// ============================================================================
function OrnamentalGoldDivider() {
  return (
    <div className="flex items-center justify-center gap-2.5 py-1 select-none" aria-hidden="true">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C9A24A]/40 to-[#C9A24A]/80" />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#C9A24A" className="opacity-90">
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
      </svg>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C9A24A]/40 to-[#C9A24A]/80" />
    </div>
  );
}

// ============================================================================
// MAIN REVIEW HUB COMPONENT (REPLICATING 3D CAR CARE REVIEW WORKFLOW)
// ============================================================================
interface BrijawasiReviewHubProps {
  initialView?: "landing" | "review";
}

export default function BrijawasiReviewHub({
  initialView = "landing",
}: BrijawasiReviewHubProps) {
  const [currentView, setCurrentView] = useState<"landing" | "review">(initialView);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>("en");

  // FORM STATE - STRICTLY EPHEMERAL (RESETS TO EMPTY ON PAGE RELOAD)
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customService, setCustomService] = useState<string>("");

  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [customDish, setCustomDish] = useState<string>("");

  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    food_quality: true,
    food_experience: true,
    service: false,
    restaurant_experience: false,
  });

  // Star Rating (0 = unselected initially)
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Optional Custom Feedback
  const [experienceText, setExperienceText] = useState<string>("");

  // 6 Review Suggestions & Selected Option
  const [suggestions, setSuggestions] = useState<ReviewSuggestion[]>([]);
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<number | null>(null);
  const [generatedReview, setGeneratedReview] = useState<string>("");

  // Carousel Active Index (0 to 5)
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Action & State Flags
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasOpenedGoogle, setHasOpenedGoogle] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // QR Code & Printable Standee State
  const [permanentUrl, setPermanentUrl] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [year, setYear] = useState<number>(2026);

  const experienceInputId = useId();
  const reviewResultId = useId();
  const reviewTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize: Clean slate on reload, load permanent slug
  useEffect(() => {
    if (typeof window !== "undefined") {
      setYear(new Date().getFullYear());

      // Check if URL specifies review mode
      const params = new URLSearchParams(window.location.search);
      if (
        params.get("view") === "review" ||
        params.get("review") === "true" ||
        window.location.hash === "#review"
      ) {
        setCurrentView("review");
      }

      const handlePopState = (e: PopStateEvent) => {
        if (e.state?.view) {
          setCurrentView(e.state.view);
        } else {
          const p = new URLSearchParams(window.location.search);
          if (p.get("view") === "review") {
            setCurrentView("review");
          } else {
            setCurrentView(initialView);
          }
        }
      };
      window.addEventListener("popstate", handlePopState);
      const origin = window.location.origin;
      const fullUrl = `${origin}${BRIJAWASI_CONFIG.permanentSlug}`;
      setPermanentUrl(fullUrl);

      // Clean out any old persisted draft sessions
      try {
        sessionStorage.removeItem("brijawasi_restaurant_review_session_v1");
        sessionStorage.removeItem("3d_car_care_session_review_v3");
        localStorage.removeItem("brijawasi_restaurant_draft");
      } catch {
        // Ignore
      }

      // Auto-detect Hindi locale
      const navLang = navigator.language?.toLowerCase() || "";
      if (navLang.startsWith("hi")) {
        setLanguage("hi");
      }

      // Generate Table QR Code
      QRCode.toDataURL(fullUrl, {
        width: 600,
        margin: 2,
        color: {
          dark: "#701C22",
          light: "#FFF9EF",
        },
        errorCorrectionLevel: "H",
      })
        .then((dataUri) => setQrDataUrl(dataUri))
        .catch((err) => console.error("QR Code error:", err));
    }
  }, []);

  // Auto-resize review textarea
  useEffect(() => {
    if (reviewTextareaRef.current) {
      reviewTextareaRef.current.style.height = "auto";
      reviewTextareaRef.current.style.height = `${Math.max(96, reviewTextareaRef.current.scrollHeight)}px`;
    }
  }, [generatedReview]);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  const handleOpenReview = () => {
    setCurrentView("review");
    setShowAnimation(true);
    if (typeof window !== "undefined") {
      window.history.pushState({ view: "review" }, "", "?view=review");
    }
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
    setShowAnimation(false);
    if (typeof window !== "undefined") {
      window.history.pushState({ view: "landing" }, "", "/");
    }
  };

  const handleToggleService = (name: string) => {
    setSelectedServices((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const handleToggleDish = (name: string) => {
    setSelectedDishes((prev) =>
      prev.includes(name) ? prev.filter((d) => d !== name) : [...prev, name]
    );
  };

  const handleToggleExperience = (name: string) => {
    setSelectedExperiences((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]
    );
  };

  const handleToggleCategoryExpand = (key: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleClearDraft = () => {
    setSuggestions([]);
    setSelectedSuggestionId(null);
    setGeneratedReview("");
    setExperienceText("");
    setSelectedServices([]);
    setSelectedDishes([]);
    setSelectedExperiences([]);
    setCustomDish("");
    setCustomService("");
    setRating(0);
    setHasOpenedGoogle(false);
    setCopied(false);
    setCarouselIndex(0);
    setErrorMessage("");
  };

  const handleGenerateReview = async () => {
    setErrorMessage("");

    if (rating === 0) {
      setErrorMessage(
        language === "hi"
          ? "कृपया रिव्यू तैयार करने के लिए 1 से 5 स्टार रेटिंग अवश्य चुनें।"
          : language === "hinglish"
          ? "Please pehle 1 se 5 star rating select karein."
          : "Please select a star rating (1 to 5 stars) to generate your reviews."
      );
      return;
    }

    setIsGenerating(true);
    setCopied(false);
    setHasOpenedGoogle(false);

    const finalDishes = [...selectedDishes];
    if (customDish.trim() && !finalDishes.includes(customDish.trim())) {
      finalDishes.push(customDish.trim());
    }

    const finalServices = [...selectedServices];
    if (customService.trim() && !finalServices.includes(customService.trim())) {
      finalServices.push(customService.trim());
    }

    try {
      const res = await fetch("/api/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: "brijawasi",
          businessType: "restaurant",
          businessName: BRIJAWASI_CONFIG.name,
          dishes: finalDishes,
          services: finalServices,
          experiences: selectedExperiences,
          rating,
          feedback: experienceText,
          language,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
        setSelectedSuggestionId(1);
        setGeneratedReview(data.suggestions[0].text);
        setCarouselIndex(0);
        if (carouselRef.current) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      } else {
        setErrorMessage(data.error || "Failed to generate reviews. Please try again.");
      }
    } catch (err) {
      console.error("Generate reviews error:", err);
      setErrorMessage("Network issue. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectSuggestion = (suggestion: ReviewSuggestion, index: number) => {
    setSelectedSuggestionId(suggestion.id);
    setGeneratedReview(suggestion.text);
    setCarouselIndex(index);
    setCopied(false);
  };

  const scrollToCarouselCard = (index: number) => {
    if (!carouselRef.current) return;
    const cards = carouselRef.current.children;
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setCarouselIndex(index);
    }
  };

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const cardWidth = carouselRef.current.offsetWidth * 0.85;
    const newIndex = Math.min(
      Math.max(0, Math.round(scrollLeft / cardWidth)),
      suggestions.length - 1
    );
    if (newIndex !== carouselIndex && newIndex >= 0) {
      setCarouselIndex(newIndex);
    }
  };

  const copyToClipboard = (text: string): boolean => {
    if (!text) return false;
    let successful = false;

    // Strategy 1: Active Textarea Selection (Directly in DOM - 100% reliable across browsers)
    if (reviewTextareaRef.current) {
      try {
        reviewTextareaRef.current.focus();
        reviewTextareaRef.current.select();
        reviewTextareaRef.current.setSelectionRange(0, text.length);
        successful = document.execCommand("copy");
      } catch (err) {
        console.warn("Direct textarea copy error:", err);
      }
    }

    // Strategy 2: Modern Navigator Clipboard API
    if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
      try {
        navigator.clipboard.writeText(text).catch((err) => {
          console.warn("navigator.clipboard.writeText rejected:", err);
        });
        successful = true;
      } catch (err) {
        console.warn("navigator.clipboard error:", err);
      }
    }

    // Strategy 3: Offscreen textarea fallback (works if textarea wasn't focused)
    if (!successful) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.top = "0";
        textarea.style.left = "0";
        textarea.style.width = "2em";
        textarea.style.height = "2em";
        textarea.style.padding = "0";
        textarea.style.border = "none";
        textarea.style.outline = "none";
        textarea.style.boxShadow = "none";
        textarea.style.background = "transparent";
        textarea.setAttribute("readonly", "");
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        textarea.setSelectionRange(0, text.length);
        successful = document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch (err) {
        console.warn("Offscreen textarea copy error:", err);
      }
    }

    return successful;
  };

  /**
   * EXACT 3D CAR CARE SYNCHRONOUS POPUP-SAFE FLOW:
   * 1. Copies selected edited review text FIRST while page has direct user focus & activation.
   * 2. Synchronously opens verified Google Maps destination in new tab.
   * 3. Renders the inline 3-step paste confirmation card right below the button.
   */
  const handleCopyAndOpenGoogle = () => {
    const textToCopy = generatedReview.trim();
    if (!textToCopy) {
      setErrorMessage(
        language === "hi"
          ? "कृपया पहले कोई एक रिव्यू चुनें या तैयार करें।"
          : "Please select or generate a review first."
      );
      return;
    }

    // 1. MUST COPY FIRST while page has active user gesture & document focus
    copyToClipboard(textToCopy);

    // 2. Synchronously open verified Brijawasi Google destination (popup-safe)
    const destinationUrl = BRIJAWASI_CONFIG.googleReviewUrl;
    window.open(destinationUrl, "_blank", "noopener,noreferrer");

    // 3. Reveal the inline 3-step confirmation box
    setCopied(true);
    setHasOpenedGoogle(true);
  };

  const ratingDescriptions: Record<number, { en: string; hi: string; hinglish: string }> = {
    1: { en: "Needs Improvement", hi: "सुधार की आवश्यकता", hinglish: "Needs Improvement" },
    2: { en: "Fair", hi: "साधारण अनुभव", hinglish: "Fair Experience" },
    3: { en: "Average Experience", hi: "औसत अनुभव", hinglish: "Average Tha" },
    4: { en: "Very Good Experience", hi: "बहुत अच्छा अनुभव", hinglish: "Bohot Achha Tha" },
    5: { en: "Outstanding / Royal Taste", hi: "लाजवाब स्वाद व अनुभव", hinglish: "Ekdum Lajawab!" },
  };

  if (currentView === "landing") {
    return (
      <>
        <BrajwasiLandingPage
          onOpenReview={handleOpenReview}
          onOpenTableCard={() => setShowPrintModal(true)}
        />
        {/* Printable Standee Modal (accessible from landing page) */}
        {showPrintModal && (
          <BrijawasiTableCardPrintable
            qrDataUrl={qrDataUrl}
            permanentUrl={permanentUrl}
            onClose={() => setShowPrintModal(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      {/* 3D Food Loading Animation: Steaming Handi + 3D Paneer Paratha */}
      {showAnimation && (
        <FoodOpeningAnimation
          onComplete={handleAnimationComplete}
          restaurantName={BRIJAWASI_CONFIG.name}
        />
      )}

      {/* Main Restaurant Experience Container (Rich Deep Burgundy & Maroon) */}
      <div className="w-full min-h-screen bg-[#3B1118] text-[#FFF9EF] px-2 sm:px-6 py-4 sm:py-8 flex flex-col items-center justify-start overflow-x-hidden">
        {/* Main Central Restaurant Review Card */}
        <div className="relative w-full max-w-xl min-w-0 bg-gradient-to-b from-[#56141B] via-[#431016] to-[#2E0B10] rounded-2xl sm:rounded-3xl border-2 border-[#C9A24C]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(201,162,74,0.2)] overflow-hidden box-border">
          {/* Top Royal Gold Ribbon */}
          <div className="h-2 w-full bg-gradient-to-r from-[#C9A24C] via-[#FFF3DB] to-[#C9A24C]" />

          {/* Card Inner Content */}
          <div className="p-3 sm:p-7 space-y-4 sm:space-y-6 min-w-0">
            {/* Top Navigation Row: Back to Landing Page Options */}
            <div className="flex items-center justify-between pb-2 border-b border-[#C9A24A]/30">
              <button
                type="button"
                onClick={handleBackToLanding}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#701C22] border border-[#C9A24A]/50 text-xs font-semibold text-[#FFF9EF] hover:bg-[#852229] hover:text-[#C9A24A] transition-colors cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-[#C9A24A]" />
                <span>Back to Options</span>
              </button>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C9A24A]">
                <Sparkles className="w-3 h-3 text-[#E5BA58]" />
                <span>Google Review Assistant</span>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* Header: Official Logo, Title, Subtitle, Language */}
            {/* ---------------------------------------------------- */}
            <div className="flex flex-col items-center text-center space-y-2.5 sm:space-y-3 min-w-0">
              {/* Official Logo with Golden Ornamental Ring (Prominent & Luxurious) */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 sm:p-1.5 bg-gradient-to-tr from-[#C9A24C] via-[#FFF3DB] to-[#E5BA58] shadow-[0_0_30px_rgba(201,162,74,0.35)] shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#FFF9EF] relative border-2 border-[#701C22]">
                  <Image
                    src="/brijwasi-logo.jpg"
                    alt={BRIJAWASI_CONFIG.name}
                    fill
                    priority
                    sizes="(max-width: 640px) 112px, 144px"
                    className="object-contain p-1"
                  />
                </div>
              </div>

              {/* Verified Listing Badges */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-full">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#3B1118] border border-[#C9A24A]/60 text-[#C9A24A] text-[11px] sm:text-xs font-bold tracking-wide shadow-sm">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E5BA58]" />
                  <span>Royal Awadhi Dining</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#701C22] border border-[#C9A24A]/40 text-[#FFF9EF] text-[11px] sm:text-xs font-medium hover:bg-[#852229] transition-colors shadow-sm"
                  title="View Table Standee QR"
                >
                  <QrCode className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C9A24A]" />
                  <span>Table QR</span>
                </button>
              </div>

              {/* Headings */}
              <div className="space-y-1 pt-1 min-w-0 max-w-full">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-extrabold text-[#FFF9EF] tracking-tight leading-snug px-1 break-words">
                  Welcome to {BRIJAWASI_CONFIG.name}
                </h1>
                <p className="text-xs sm:text-base font-semibold text-[#C9A24C]">
                  Authentic Taste. Royal Experience.
                </p>
                <p className="text-[11px] sm:text-xs text-[#FFF3DB]/80 max-w-md mx-auto">
                  Thank you for dining with us. How was your food and hospitality today?
                </p>
              </div>

              {/* Language Switcher */}
              <div className="pt-1 flex items-center justify-center gap-1 p-1 bg-[#3B1118] rounded-xl border border-[#C9A24A]/50 text-xs shadow-inner">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    language === "en"
                      ? "bg-[#C9A24A] text-[#3B1118] font-bold shadow-sm"
                      : "text-[#FFF9EF]/80 hover:text-white"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    language === "hi"
                      ? "bg-[#C9A24A] text-[#3B1118] font-bold shadow-sm"
                      : "text-[#FFF9EF]/80 hover:text-white"
                  }`}
                >
                  हिंदी
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("hinglish")}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    language === "hinglish"
                      ? "bg-[#C9A24A] text-[#3B1118] font-bold shadow-sm"
                      : "text-[#FFF9EF]/80 hover:text-white"
                  }`}
                >
                  Hinglish
                </button>
              </div>
            </div>

            <OrnamentalGoldDivider />

            {/* ---------------------------------------------------- */}
            {/* Step 1: Restaurant Services (Multi-select) */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-2 min-w-0">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-[#FFF9EF] flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#C9A24A]" />
                  <span>
                    {language === "hi"
                      ? "1. आपने किस सेवा का उपयोग किया? (एक से अधिक चुन सकते हैं)"
                      : "1. Which service(s) did you use? (Select all that apply)"}
                  </span>
                </label>
                {selectedServices.length > 0 && (
                  <span className="text-[11px] font-bold text-[#C9A24A]">
                    {selectedServices.length} selected
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 w-full min-w-0">
                {BRIJAWASI_SERVICES.map((srv) => {
                  const isSelected = selectedServices.includes(srv.name);
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => handleToggleService(srv.name)}
                      className={`flex items-center justify-between min-w-0 px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl text-xs font-semibold border text-left transition-all active:scale-98 ${
                        isSelected
                          ? "bg-[#701C22] border-[#C9A24A] text-[#FFF9EF] shadow-md ring-1 ring-[#C9A24A]"
                          : "bg-[#3B1118]/80 border-[#C9A24A]/30 text-[#FFF9EF]/85 hover:border-[#C9A24A]/60 hover:bg-[#4E1720]"
                      }`}
                    >
                      <span className="truncate text-[11px] sm:text-xs">
                        {language === "hi" ? srv.nameHindi : srv.name}
                      </span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 text-[#C9A24A] shrink-0 ml-1" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-[#C9A24A]/40 shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Optional Custom Service Input */}
              {selectedServices.includes("Other") && (
                <div className="pt-1">
                  <input
                    type="text"
                    value={customService}
                    onChange={(e) => setCustomService(e.target.value)}
                    placeholder={
                      language === "hi"
                        ? "अन्य सेवा विवरण लिखें..."
                        : "Describe other service (e.g. Bulk order, Catering)..."
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#3B1118] border border-[#C9A24A]/50 text-xs text-[#FFF9EF] placeholder-[#FFF3DB]/40 focus:outline-none focus:ring-1 focus:ring-[#C9A24A]"
                  />
                </div>
              )}
            </div>

            <OrnamentalGoldDivider />

            {/* ---------------------------------------------------- */}
            {/* Step 2: EXACT AUTHORITATIVE 7 DISHES (+ Other) */}
            {/* Compact Responsive Two-Column Grid with Culinary Icons */}
            {/* NO PRICES ANYWHERE */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-2.5 min-w-0">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-[#FFF9EF] flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-[#C9A24A]" />
                  <span>
                    {language === "hi"
                      ? "2. आपने क्या-क्या खाया? (मेनू से चुनें)"
                      : "2. What did you order / enjoy? (Authoritative Menu)"}
                  </span>
                </label>
                {selectedDishes.length > 0 && (
                  <span className="text-[11px] font-bold text-[#C9A24A]">
                    {selectedDishes.length} selected
                  </span>
                )}
              </div>

              <p className="text-[11px] text-[#FFF3DB]/75 leading-relaxed">
                {language === "hi"
                  ? "चयनित व्यंजनों के आधार पर ही आपके रिव्यू तैयार होंगे। कोई भी डिश अनिवार्य नहीं है।"
                  : "Your review suggestions will reflect only the dishes you choose."}
              </p>

              {/* Compact Responsive 2-Column Grid */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2.5 w-full min-w-0">
                {BRIJAWASI_MENU_ITEMS.map((dish) => {
                  const isSelected = selectedDishes.includes(dish.name);
                  const isOther = dish.id === "other-dish";

                  return (
                    <button
                      key={dish.id}
                      type="button"
                      onClick={() => handleToggleDish(dish.name)}
                      className={`flex items-center gap-1.5 sm:gap-2 p-2 sm:p-2.5 min-w-0 rounded-xl border text-left transition-all active:scale-98 ${
                        isOther ? "col-span-2" : "col-span-1"
                      } ${
                        isSelected
                          ? "bg-[#701C22] border-2 border-[#C9A24C] text-[#FFF9EF] shadow-md ring-1 ring-[#C9A24C]"
                          : "bg-[#3B1118]/80 border border-[#C9A24C]/35 text-[#FFF9EF]/90 hover:border-[#C9A24A]/60 hover:bg-[#4E1720]"
                      }`}
                    >
                      <DishIllustratedIcon dishId={dish.id} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] sm:text-sm font-bold text-[#FFF9EF] leading-tight truncate">
                          {language === "hi" ? dish.nameHindi : dish.name}
                        </p>
                        <p className="text-[9px] sm:text-[11px] text-[#FFF3DB]/75 leading-tight truncate">
                          {language === "hi" ? dish.name : dish.nameHindi}
                        </p>
                      </div>
                      {isSelected ? (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#C9A24A] flex items-center justify-center shrink-0 shadow-sm">
                          <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#3B1118]" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-[#C9A24A]/40 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Other Dish Custom Input */}
              {selectedDishes.includes("Other") && (
                <div className="pt-1">
                  <input
                    type="text"
                    value={customDish}
                    onChange={(e) => setCustomDish(e.target.value)}
                    placeholder={
                      language === "hi"
                        ? "अपनी पसंद की डिश का नाम लिखें..."
                        : "Type your custom dish name (e.g. Special Roll, Chutney)..."
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#3B1118] border-2 border-[#C9A24A] text-xs text-[#FFF9EF] placeholder-[#FFF3DB]/40 focus:outline-none focus:ring-1 focus:ring-[#C9A24A]"
                  />
                </div>
              )}
            </div>

            <OrnamentalGoldDivider />

            {/* ---------------------------------------------------- */}
            {/* Step 3: Customer Experience Chips (Categorized) */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-3 min-w-0">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm font-bold text-[#FFF9EF] flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#C9A24A]" />
                  <span>
                    {language === "hi"
                      ? "3. आपको क्या सबसे अच्छा लगा? (अनुभव के बिंदु)"
                      : "3. What did you enjoy about your experience?"}
                  </span>
                </label>
                {selectedExperiences.length > 0 && (
                  <span className="text-[11px] font-bold text-[#C9A24A]">
                    {selectedExperiences.length} selected
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {BRIJAWASI_EXPERIENCE_CATEGORIES.map((cat) => {
                  const isExpanded = expandedCategories[cat.key];
                  const countInCategory = cat.items.filter((item) =>
                    selectedExperiences.includes(item.name)
                  ).length;

                  return (
                    <div
                      key={cat.key}
                      className="rounded-xl border border-[#C9A24A]/30 bg-[#3B1118]/70 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleCategoryExpand(cat.key)}
                        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#701C22]/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#C9A24A] uppercase tracking-wider">
                            {language === "hi" ? cat.titleHindi : cat.title}
                          </span>
                          {countInCategory > 0 && (
                            <span className="px-1.5 py-0.2 rounded-full bg-[#C9A24A] text-[#3B1118] text-[10px] font-bold">
                              {countInCategory}
                            </span>
                          )}
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#C9A24A]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#C9A24A]/70" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-2.5 pt-0 flex flex-wrap gap-1.5">
                          {cat.items.map((item) => {
                            const isSelected = selectedExperiences.includes(item.name);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleToggleExperience(item.name)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
                                  isSelected
                                    ? "bg-[#C9A24A] border-[#FFF9EF] text-[#3B1118] font-bold shadow-sm"
                                    : "bg-[#701C22]/80 border-[#C9A24A]/30 text-[#FFF9EF]/90 hover:border-[#C9A24A]"
                                }`}
                              >
                                {language === "hi" ? item.nameHindi : item.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <OrnamentalGoldDivider />

            {/* ---------------------------------------------------- */}
            {/* Step 4: Star Rating (5 Interactive Stars, 0 Initial) */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-2 text-center min-w-0">
              <label className="text-xs sm:text-sm font-bold text-[#FFF9EF] block">
                {language === "hi"
                  ? "4. आपका कुल अनुभव कैसा रहा? (स्टार रेटिंग चुनें)"
                  : "4. How was your overall experience? (Select Star Rating)"}
              </label>

              <div
                className="flex items-center justify-center gap-2 sm:gap-3 py-1"
                role="radiogroup"
                aria-label="Star rating"
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${star} star${star > 1 ? "s" : ""}`}
                      className="p-1 focus:outline-none transition-transform hover:scale-115 active:scale-95"
                    >
                      <Star
                        className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors drop-shadow-lg ${
                          isFilled
                            ? "fill-[#C9A24A] text-[#C9A24A]"
                            : "fill-transparent text-[#FFF9EF]/30 hover:text-[#C9A24A]/60"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="h-5">
                {rating > 0 ? (
                  <p className="text-xs font-bold text-[#C9A24A]">
                    ★ {rating} / 5 —{" "}
                    {language === "hi"
                      ? ratingDescriptions[rating].hi
                      : language === "hinglish"
                      ? ratingDescriptions[rating].hinglish
                      : ratingDescriptions[rating].en}
                  </p>
                ) : (
                  <p className="text-xs text-[#FFF3DB]/60">
                    {language === "hi"
                      ? "कृपया 1 से 5 स्टार में से चुनें"
                      : "Tap a star to rate your dining experience"}
                  </p>
                )}
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* Step 5: Optional Notes */}
            {/* ---------------------------------------------------- */}
            <div className="space-y-1.5 min-w-0">
              <label
                htmlFor={experienceInputId}
                className="text-xs font-semibold text-[#FFF9EF]/90 flex items-center justify-between"
              >
                <span>
                  {language === "hi"
                    ? "5. कोई खास टिप्पणी या संदेश? (वैकल्पिक)"
                    : "5. Any personal compliments or custom notes? (Optional)"}
                </span>
                <span className="text-[10px] text-[#C9A24A] font-medium">Optional</span>
              </label>
              <textarea
                id={experienceInputId}
                value={experienceText}
                onChange={(e) => setExperienceText(e.target.value)}
                placeholder={
                  language === "hi"
                    ? "उदा. कबाब परांठा बहुत स्वादिष्ट था, रोल में मसाला एकदम परफेक्ट था, सेवा बहुत तेज रही..."
                    : "e.g. Veg Kabab Paratha was super crispy and soft, quick service, delicious authentic flavour..."
                }
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#3B1118] border border-[#C9A24A]/50 text-xs sm:text-sm text-[#FFF9EF] placeholder-[#FFF3DB]/40 focus:outline-none focus:ring-1 focus:ring-[#C9A24A] resize-none"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* Generate Action Button */}
            {/* ---------------------------------------------------- */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleGenerateReview}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#C9A24A] via-[#E5BA58] to-[#C9A24A] text-[#3B1118] font-extrabold text-sm sm:text-base tracking-wide shadow-xl hover:shadow-2xl hover:brightness-105 active:scale-98 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#3B1118]" />
                    <span>
                      {language === "hi"
                        ? "रिव्यू तैयार हो रहे हैं..."
                        : "Crafting 6 Royal Review Suggestions..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#3B1118]" />
                    <span>
                      {language === "hi"
                        ? "6 लखनवी रिव्यू विकल्प तैयार करें"
                        : "Generate 6 Royal Reviews"}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* ---------------------------------------------------- */}
            {/* 6-Review Horizontal Swipeable Carousel */}
            {/* ---------------------------------------------------- */}
            {suggestions.length > 0 && (
              <div className="space-y-4 pt-3 border-t border-[#C9A24A]/40 animate-fade-in min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#FFF9EF] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C9A24A]" />
                      <span>Choose Your Preferred Review Style</span>
                    </h3>
                    <p className="text-[11px] text-[#FFF3DB]/70">
                      Swipe left/right to view all 6 styles, then tap Select.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#3B1118] border border-[#C9A24A]/50 text-[#C9A24A] text-[11px] font-bold">
                      {carouselIndex + 1} / {suggestions.length}
                    </span>
                    <div className="hidden sm:flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => scrollToCarouselCard(Math.max(0, carouselIndex - 1))}
                        disabled={carouselIndex === 0}
                        aria-label="Previous review"
                        className="p-1 rounded-lg bg-[#3B1118] border border-[#C9A24A]/30 text-[#FFF9EF] disabled:opacity-40 hover:bg-[#701C22]"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          scrollToCarouselCard(
                            Math.min(suggestions.length - 1, carouselIndex + 1)
                          )
                        }
                        disabled={carouselIndex === suggestions.length - 1}
                        aria-label="Next review"
                        className="p-1 rounded-lg bg-[#3B1118] border border-[#C9A24A]/30 text-[#FFF9EF] disabled:opacity-40 hover:bg-[#701C22]"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Horizontal Swipeable Track */}
                <div
                  ref={carouselRef}
                  onScroll={handleCarouselScroll}
                  className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory py-2 px-0.5"
                >
                  {suggestions.map((suggestion, idx) => {
                    const isSelected = selectedSuggestionId === suggestion.id;
                    return (
                      <div
                        key={suggestion.id}
                        className={`min-w-[85%] sm:min-w-[320px] max-w-[340px] shrink-0 p-3.5 rounded-2xl border snap-center flex flex-col justify-between transition-all ${
                          isSelected
                            ? "bg-[#701C22] border-2 border-[#C9A24A] shadow-xl ring-1 ring-[#C9A24A]"
                            : "bg-[#3B1118]/90 border-[#C9A24A]/40 text-[#FFF9EF]/85 hover:border-[#C9A24A]/70"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded-full bg-[#3B1118] border border-[#C9A24A]/50 text-[#C9A24A] text-[10px] font-bold tracking-wide">
                              {suggestion.styleLabel}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-[#C9A24A]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24A]" />
                                <span>Selected</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-[#FFF9EF] leading-relaxed line-clamp-5">
                            &ldquo;{suggestion.text}&rdquo;
                          </p>
                        </div>

                        <div className="pt-3">
                          <button
                            type="button"
                            onClick={() => handleSelectSuggestion(suggestion, idx)}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? "bg-[#C9A24A] text-[#3B1118] shadow-md"
                                : "bg-[#3B1118] border border-[#C9A24A]/50 text-[#FFF9EF] hover:bg-[#701C22]"
                            }`}
                          >
                            {isSelected ? "Selected for Google" : "Select This Review"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ---------------------------------------------------- */}
                {/* SELECTED REVIEW (EDITABLE) - EXACT 3D CAR CARE FLOW */}
                {/* ---------------------------------------------------- */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={reviewResultId}
                      className="text-xs font-extrabold uppercase tracking-wider text-[#FFF9EF] flex items-center gap-1.5"
                    >
                      <span>SELECTED REVIEW (EDITABLE)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          copyToClipboard(generatedReview.trim());
                          setCopied(true);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#701C22] border border-[#C9A24A]/50 text-[#C9A24A] hover:text-[#FFF9EF] hover:bg-[#852229] transition-colors"
                        title="Copy this review text"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Text</span>
                      </button>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              (rating || 5) >= s
                                ? "fill-[#C9A24A] text-[#C9A24A]"
                                : "fill-transparent text-[#FFF9EF]/20"
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const original = suggestions.find((s) => s.id === selectedSuggestionId);
                          if (original) setGeneratedReview(original.text);
                        }}
                        className="text-[#C9A24A] hover:text-[#FFF9EF] transition-colors p-0.5"
                        title="Reset to original generated text"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    id={reviewResultId}
                    ref={reviewTextareaRef}
                    value={generatedReview}
                    onChange={(e) => setGeneratedReview(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-2xl bg-[#3B1118] border-2 border-[#C9A24A]/70 text-xs sm:text-sm text-[#FFF9EF] font-medium leading-relaxed focus:outline-none focus:border-[#C9A24A] focus:ring-1 focus:ring-[#C9A24A] resize-none"
                  />

                  {/* Regenerate All 6 */}
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleGenerateReview}
                      disabled={isGenerating}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#C9A24A] hover:underline disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isGenerating ? "animate-spin" : ""}`} />
                      <span>Regenerate All 6</span>
                    </button>
                  </div>
                </div>

                {/* Primary Action Button: COPY SELECTED REVIEW & OPEN GOOGLE */}
                <div className="pt-2 space-y-3">
                  <button
                    type="button"
                    onClick={handleCopyAndOpenGoogle}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#C9A24A] via-[#E5BA58] to-[#C9A24A] text-[#3B1118] font-extrabold text-xs sm:text-sm md:text-base tracking-wide shadow-2xl hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4 text-[#3B1118] shrink-0" />
                    <span>COPY SELECTED REVIEW &amp; OPEN GOOGLE</span>
                    <ExternalLink className="w-4 h-4 text-[#3B1118] shrink-0" />
                  </button>

                  {/* Exact 3D Car Care Inline Confirmation Card */}
                  {copied && (
                    <div className="p-4 rounded-2xl bg-[#3B1118]/95 border-2 border-[#C9A24A] shadow-xl space-y-3 animate-fade-in text-left">
                      <div className="flex items-start gap-2 text-xs sm:text-sm font-bold text-[#FFF9EF]">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A24A] shrink-0 mt-0.5" />
                        <span>
                          Your review is copied! Paste it into Google, select your star rating and tap Post.
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-[#701C22]/90 border border-[#C9A24A]/40 text-[#FFF9EF] font-semibold flex flex-col items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5 text-[#C9A24A]" />
                          <span>1. Review Copied</span>
                        </div>
                        <div className="p-2 sm:p-2.5 rounded-xl bg-[#701C22]/90 border border-[#C9A24A]/40 text-[#FFF9EF] font-semibold flex flex-col items-center justify-center gap-1">
                          <ClipboardPaste className="w-3.5 h-3.5 text-[#C9A24A]" />
                          <span>2. Paste in Google Box</span>
                        </div>
                        <div className="p-2 sm:p-2.5 rounded-xl bg-[#701C22]/90 border border-[#C9A24A]/40 text-[#FFF9EF] font-semibold flex flex-col items-center justify-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#C9A24A] text-[#C9A24A]" />
                          <span>3. Select Stars &amp; Post</span>
                        </div>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            copyToClipboard(generatedReview.trim());
                            setCopied(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#701C22] border border-[#C9A24A]/60 text-[#C9A24A] text-xs font-bold hover:bg-[#852229] hover:text-[#FFF9EF] transition-all"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy review text again</span>
                        </button>
                        <a
                          href={BRIJAWASI_CONFIG.googleReviewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#C9A24A] hover:underline"
                        >
                          <span>Didn&apos;t open? Tap here</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Clear Draft Option */}
            {(suggestions.length > 0 || rating > 0 || selectedDishes.length > 0) && (
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={handleClearDraft}
                  className="inline-flex items-center gap-1 text-[11px] text-[#FFF3DB]/60 hover:text-[#C9A24A] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear and start over</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer Branding */}
          <div className="py-3 px-6 bg-[#2B0B11] border-t border-[#C9A24A]/25 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FFF3DB]/60 gap-1.5">
            <span>
              &copy; {year} {BRIJAWASI_CONFIG.name}. All rights reserved.
            </span>
            <div className="flex items-center gap-2">
              <span>26-A, MR 9 Rd, Chandra Nagar, Indore</span>
              <span>•</span>
              <span>Royal Awadhi Vegetarian</span>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Restaurant Table Standee Modal */}
      {showPrintModal && (
        <BrijawasiTableCardPrintable
          qrDataUrl={qrDataUrl}
          permanentUrl={permanentUrl}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </>
  );
}
