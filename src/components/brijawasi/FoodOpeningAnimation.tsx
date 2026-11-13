"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles, X } from "lucide-react";

interface FoodOpeningAnimationProps {
  onComplete: () => void;
  restaurantName?: string;
}

export default function FoodOpeningAnimation({
  onComplete,
  restaurantName = "Brijawasi Lucknow Special",
}: FoodOpeningAnimationProps) {
  const [phase, setPhase] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => onComplete(), 300);
    }, 1850);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => onComplete(), 100);
  };

  return (
    <div
      role="dialog"
      aria-label="Welcome to Brijawasi Lucknow Special"
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#3B1118] text-[#FFF9EF] px-4 select-none transition-opacity duration-300 cursor-pointer ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Royal Burgundy & Gold Radial Glow */}
      <div className="absolute inset-0 bg-radial from-[#701C22]/90 via-[#3B1118] to-[#20080C] pointer-events-none" />
      <div className="absolute inset-0 bg-royal-maroon-pattern opacity-40 pointer-events-none" />

      {/* Floating Lucknowi Spices (Pure Lightweight SVG) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Star Anise */}
        <div className="absolute top-[16%] left-[10%] opacity-40 animate-spice-float">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="#C9A24A">
            <path d="M12 2L13.5 8L19.5 6.5L16 11.5L21.5 14L15.5 15.5L17 21.5L12 18L7 21.5L8.5 15.5L2.5 14L8 11.5L4.5 6.5L10.5 8L12 2Z" />
          </svg>
        </div>

        {/* Cardamom Pod */}
        <div
          className="absolute top-[20%] right-[10%] opacity-40 animate-spice-float"
          style={{ animationDelay: "1.1s" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#E5BA58">
            <ellipse cx="12" cy="12" rx="6" ry="10" transform="rotate(35 12 12)" />
            <path d="M12 3 L12 21 M8 7 Q12 12 16 17" stroke="#FFF9EF" strokeWidth="0.8" fill="none" opacity="0.6" />
          </svg>
        </div>

        {/* Saffron Threads */}
        <div
          className="absolute bottom-[18%] left-[12%] opacity-50 animate-spice-float"
          style={{ animationDelay: "0.5s" }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#E5BA58" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 26 C10 20, 14 18, 24 8" />
            <path d="M10 28 C14 22, 18 19, 28 12" stroke="#C9A24A" />
          </svg>
        </div>
      </div>

      {/* Skip Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        className="absolute top-5 right-5 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#701C22] border border-[#C9A24A]/50 text-[#FFF9EF] text-xs font-semibold tracking-wide shadow-md hover:bg-[#852229] transition-all"
        aria-label="Skip animation"
      >
        <span>Skip</span>
        <X className="w-3.5 h-3.5 text-[#C9A24A]" />
      </button>

      {/* Center 3D Food Stage: Handi + Paneer Paratha */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-sm text-center">
        {/* Dishes Duo Container */}
        <div className="relative w-56 h-48 flex items-center justify-center mb-4">
          {/* Golden Radial Backlight */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#C9A24A]/30 via-[#E5BA58]/20 to-transparent blur-2xl animate-pulse" />

          {/* 1. Traditional Steaming Veg Biryani Handi (Left position) */}
          <div className="absolute left-2 bottom-3 w-32 h-32 z-10 drop-shadow-2xl">
            {/* Rising Steam Trails */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-16 flex justify-center gap-2 pointer-events-none">
              <span className="w-1.5 h-6 bg-gradient-to-t from-white/40 to-transparent rounded-full animate-steam-1" />
              <span className="w-2 h-8 bg-gradient-to-t from-[#FFF3DB]/60 to-transparent rounded-full animate-steam-2" />
              <span className="w-1.5 h-6 bg-gradient-to-t from-white/40 to-transparent rounded-full animate-steam-3" />
            </div>

            {/* Handi SVG */}
            <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
              <ellipse cx="60" cy="90" rx="44" ry="16" fill="#6A2E14" />
              <path
                d="M16 68 C16 98, 34 106, 60 106 C86 106, 104 98, 104 68 C104 54, 90 50, 80 48 L40 48 C30 50, 16 54, 16 68 Z"
                fill="url(#handiGrad)"
              />
              <path d="M38 48 C38 44, 48 42, 60 42 C72 42, 82 44, 82 48 L80 52 C70 50, 50 50, 40 52 Z" fill="#C9A24A" />
              {/* Dum Seal & Spiced Veg Biryani Rice */}
              <ellipse cx="60" cy="46" rx="24" ry="7" fill="#FFF3DB" stroke="#C9A24A" strokeWidth="1.5" />
              <ellipse cx="60" cy="45" rx="19" ry="5" fill="#E5BA58" />
              <circle cx="56" cy="45" r="1.5" fill="#FFF9EF" />
              <circle cx="63" cy="44" r="1.5" fill="#FFF9EF" />
              <circle cx="61" cy="46" r="1.2" fill="#701C22" />
              <defs>
                <linearGradient id="handiGrad" x1="16" y1="50" x2="104" y2="106" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#9C4C1C" />
                  <stop offset="0.45" stopColor="#B35B22" />
                  <stop offset="0.8" stopColor="#6E330F" />
                  <stop offset="1" stopColor="#431E09" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* 2. Golden Crispy Layered Paneer Paratha (Right 3D angle) */}
          <div
            className="absolute right-1 -top-1 w-32 h-32 z-10"
            style={{ perspective: "600px" }}
          >
            <div className="w-full h-full animate-paratha-3d">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                {/* Outer Crispy Golden Crust */}
                <ellipse cx="50" cy="50" rx="46" ry="42" fill="#D99A36" stroke="#C9A24A" strokeWidth="2" />
                {/* Flaky inner layers */}
                <ellipse cx="50" cy="50" rx="38" ry="34" fill="#E8A838" stroke="#BD7A22" strokeWidth="1.2" strokeDasharray="5 3" />
                <ellipse cx="50" cy="50" rx="28" ry="25" fill="#F2BE54" stroke="#BD7A22" strokeWidth="1" strokeDasharray="4 2" />
                {/* Tawa Roast Brown Marks */}
                <circle cx="36" cy="40" r="3.2" fill="#7B3A0E" opacity="0.8" />
                <circle cx="64" cy="44" r="2.8" fill="#7B3A0E" opacity="0.8" />
                <circle cx="48" cy="62" r="3.5" fill="#7B3A0E" opacity="0.75" />
                <circle cx="56" cy="32" r="2.4" fill="#7B3A0E" opacity="0.7" />
                {/* Visible Paneer Stuffing cubes peeking through */}
                <rect x="42" y="44" width="7" height="6" rx="1.5" fill="#FFF9EF" stroke="#E5BA58" strokeWidth="0.8" />
                <rect x="52" y="47" width="6" height="5" rx="1.2" fill="#FFF9EF" stroke="#E5BA58" strokeWidth="0.8" />
                {/* Melting white butter dollop */}
                <ellipse cx="48" cy="47" rx="9" ry="6" fill="#FFF3DB" opacity="0.95" />
                <ellipse cx="49" cy="48" rx="5" ry="3" fill="#FFF9EF" />
              </svg>
            </div>
          </div>

          {/* 3. Official Brijawasi Logo Badge Reveal */}
          <div
            className={`absolute z-20 w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#C9A24A] via-[#FFF3DB] to-[#E5BA58] shadow-2xl transition-all duration-700 ease-out ${
              phase >= 1 ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-[#FFF9EF] relative border-2 border-[#701C22]">
              <Image
                src="/brijwasi-logo.jpg"
                alt="Brijawasi Lucknow Special"
                fill
                priority
                sizes="112px"
                className="object-contain p-0.5"
              />
            </div>
          </div>
        </div>

        {/* Branded Text Reveal */}
        <div
          className={`space-y-1.5 transition-all duration-500 ease-out transform ${
            phase >= 1 ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#701C22] border border-[#C9A24A]/60 text-[#C9A24A] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#E5BA58]" />
            <span>Royal Lucknowi Taste</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#FFF9EF]">
            {restaurantName}
          </h1>

          <p className="text-sm font-semibold text-[#C9A24A] tracking-wide">
            Authentic Taste. Royal Experience.
          </p>

          <p className="text-xs text-[#FFF3DB]/70 pt-1">
            Tap anywhere to begin your review
          </p>
        </div>
      </div>
    </div>
  );
}
