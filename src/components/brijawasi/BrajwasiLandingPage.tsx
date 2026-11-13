"use client";

import React from "react";
import Image from "next/image";
import {
  Star,
  ExternalLink,
  Sparkles,
  QrCode,
  MapPin,
  ChevronRight,
  Heart,
  Award,
} from "lucide-react";
import { BRAJWASI_CONFIG } from "@/lib/brijawasi-data";

interface BrajwasiLandingPageProps {
  onOpenReview: () => void;
  onOpenTableCard?: () => void;
}

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function BrajwasiLandingPage({
  onOpenReview,
  onOpenTableCard,
}: BrajwasiLandingPageProps) {
  const instagramUrl =
    BRAJWASI_CONFIG.instagramUrl ||
    "https://www.instagram.com/brajwasilucknow?exln=eDgxMHZpamt0a2I5";

  return (
    <div className="w-full max-w-xl mx-auto px-3.5 sm:px-4 py-4 sm:py-8 flex flex-col items-center">
      {/* Central Royal Landing Card */}
      <div className="relative w-full bg-gradient-to-b from-[#701C22] via-[#52151B] to-[#3B1118] rounded-2xl sm:rounded-3xl border-2 border-[#C9A24A]/60 shadow-royal-card overflow-hidden">
        {/* Top Royal Gold Accent Filigree Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#C9A24A] via-[#FFF3DB] to-[#E5BA58]" />

        {/* Content Container */}
        <div className="p-4 sm:p-7 space-y-5 sm:space-y-6">
          {/* Header Section */}
          <div className="flex flex-col items-center text-center space-y-3">
            {/* Large Official Logo with Golden Ornamental Ring */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-gradient-to-tr from-[#C9A24A] via-[#FFF3DB] to-[#E5BA58] shadow-2xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#FFF9EF] relative border-2 border-[#701C22]">
                <Image
                  src={BRAJWASI_CONFIG.logoUrl}
                  alt={BRAJWASI_CONFIG.name}
                  fill
                  priority
                  sizes="(max-width: 640px) 112px, 128px"
                  className="object-contain p-1"
                />
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#3B1118] border border-[#C9A24A]/60 text-[#C9A24A] text-[11px] font-bold tracking-wide shadow-sm">
                <Sparkles className="w-3 h-3 text-[#E5BA58]" />
                <span>Pure Vegetarian • Royal Awadhi Dining</span>
              </div>
              {onOpenTableCard && (
                <button
                  type="button"
                  onClick={onOpenTableCard}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#701C22] border border-[#C9A24A]/40 text-[#FFF9EF] text-[11px] font-medium hover:bg-[#852229] transition-colors"
                  title="View Table Standee QR"
                >
                  <QrCode className="w-3 h-3 text-[#C9A24A]" />
                  <span>Table QR</span>
                </button>
              )}
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-1.5 pt-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-extrabold text-[#FFF9EF] tracking-tight">
                Welcome to {BRAJWASI_CONFIG.name}
              </h1>
              <p className="text-sm sm:text-base font-medium text-[#FFF3DB]/90 italic">
                &ldquo;Experience our hospitality. Stay connected with us!&rdquo;
              </p>
            </div>
          </div>

          {/* Golden Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#C9A24A]/30 w-full" />
            <span className="bg-[#52151B] px-3 text-[#C9A24A] text-xs font-semibold tracking-wider uppercase">
              Select an Option
            </span>
            <div className="border-t border-[#C9A24A]/30 w-full" />
          </div>

          {/* TWO PROMINENT INTERACTIVE CARDS */}
          <div className="space-y-4">
            {/* ============================================================== */}
            {/* OPTION 1: GOOGLE REVIEW (FIRST) */}
            {/* ============================================================== */}
            <div className="group relative rounded-2xl bg-gradient-to-br from-[#701C22]/95 via-[#52151B]/95 to-[#3B1118]/95 border-2 border-[#C9A24A]/70 hover:border-[#C9A24A] shadow-xl hover:shadow-2xl transition-all duration-200 overflow-hidden">
              {/* Subtle gold glow accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A24A]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="p-4 sm:p-5 space-y-3.5 relative">
                {/* Header row: Icon & Stars */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FFF9EF] border border-[#C9A24A]/50 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <GoogleIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-serif font-bold text-[#FFF9EF] leading-snug">
                        Share Your Experience
                      </h2>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className="w-3.5 h-3.5 fill-[#C9A24A] text-[#C9A24A]"
                          />
                        ))}
                        <span className="text-[11px] font-bold text-[#E5BA58] ml-1">
                          5.0 Rated
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-[#C9A24A]/20 border border-[#C9A24A]/50 text-[#C9A24A] text-[10px] font-bold uppercase tracking-wider">
                    Recommended
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#FFF3DB]/90 leading-relaxed">
                  Enjoyed our food? Share your valuable feedback on Google.
                </p>

                {/* Features Pill */}
                <div className="flex items-center gap-2 text-[11px] text-[#C9A24A]/90 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E5BA58]" />
                    AI Review Assistant
                  </span>
                  <span>•</span>
                  <span>1-Tap Copy &amp; Open</span>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={onOpenReview}
                  className="w-full py-3.5 sm:py-4 px-5 rounded-xl bg-gradient-to-r from-[#C9A24A] via-[#E5BA58] to-[#C9A24A] text-[#3B1118] font-black text-xs sm:text-sm tracking-wide shadow-lg hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Star className="w-4 h-4 fill-[#3B1118] text-[#3B1118]" />
                  <span>WRITE A GOOGLE REVIEW</span>
                  <ChevronRight className="w-4 h-4 text-[#3B1118] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* ============================================================== */}
            {/* OPTION 2: INSTAGRAM (SECOND) */}
            {/* ============================================================== */}
            <div className="group relative rounded-2xl bg-gradient-to-br from-[#701C22]/90 via-[#4A141A]/90 to-[#3B1118]/90 border-2 border-[#C9A24A]/50 hover:border-[#C9A24A] shadow-xl hover:shadow-2xl transition-all duration-200 overflow-hidden">
              {/* Subtle pink/purple accent glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1306C]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="p-4 sm:p-5 space-y-3.5 relative">
                {/* Header row: Icon & Handle */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] p-0.5 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <div className="w-full h-full rounded-[10px] bg-[#3B1118] flex items-center justify-center">
                        <InstagramIcon className="w-5 h-5 text-[#FFF9EF]" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-serif font-bold text-[#FFF9EF] leading-snug">
                        Follow Us on Instagram
                      </h2>
                      <p className="text-[11px] font-bold text-[#E5BA58] mt-0.5">
                        @brajwasilucknow
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-[#E1306C]/20 border border-[#E1306C]/40 text-[#FFF9EF] text-[10px] font-bold uppercase tracking-wider">
                    Official
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#FFF3DB]/90 leading-relaxed">
                  Follow Brajwasi Lucknow Special for food updates, special moments and more!
                </p>

                {/* Features Pill */}
                <div className="flex items-center gap-2 text-[11px] text-[#C9A24A]/90 font-medium">
                  <span className="inline-flex items-center gap-1">
                    <Heart className="w-3 h-3 text-[#E1306C]" />
                    Food Reels &amp; Stories
                  </span>
                  <span>•</span>
                  <span>Daily Specials</span>
                </div>

                {/* Action Button */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 sm:py-4 px-5 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 text-center"
                >
                  <InstagramIcon className="w-4 h-4 text-white" />
                  <span>FOLLOW US ON INSTAGRAM</span>
                  <ExternalLink className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Footer Info & Address */}
          <div className="pt-2 text-center space-y-2 border-t border-[#C9A24A]/25">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#FFF9EF]/85 justify-center">
              <MapPin className="w-3.5 h-3.5 text-[#C9A24A] shrink-0" />
              <span>{BRAJWASI_CONFIG.observedListingReference.address}</span>
            </div>
            <p className="text-[11px] text-[#FFF3DB]/60">
              {BRAJWASI_CONFIG.tagline} • © 2026 {BRAJWASI_CONFIG.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
