"use client";

import React from "react";
import Image from "next/image";
import { X, Printer, Sparkles, Smartphone } from "lucide-react";
import { BRIJAWASI_CONFIG } from "@/lib/brijawasi-data";

interface BrijawasiTableCardProps {
  qrDataUrl: string;
  permanentUrl: string;
  onClose: () => void;
}

export default function BrijawasiTableCardPrintable({
  qrDataUrl,
  permanentUrl,
  onClose,
}: BrijawasiTableCardProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-md bg-[#3B1118] border-2 border-[#C9A24A] rounded-2xl p-6 text-[#FFF9EF] shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 rounded-full bg-[#701C22] text-[#C9A24A] hover:text-[#FFF9EF] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C9A24A]/30 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C9A24A]" />
            <span className="text-xs uppercase tracking-wider font-semibold text-[#C9A24A]">
              Printable Restaurant Standee / NFC
            </span>
          </div>
          <button
            onClick={handlePrint}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C9A24A] text-[#3B1118] text-xs font-bold hover:bg-[#E5BA58] transition-all shadow-md active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Standee</span>
          </button>
        </div>

        {/* Printable Standee Card Area */}
        <div
          id="printable-restaurant-standee"
          className="relative bg-gradient-to-b from-[#FFF9EF] to-[#FFF3DB] text-[#342019] rounded-xl p-6 text-center border-4 border-double border-[#C9A24A] shadow-inner"
        >
          {/* Royal Corner Ornaments */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#C9A24A]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#C9A24A]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#C9A24A]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#C9A24A]" />

          {/* Logo */}
          <div className="w-24 h-24 mx-auto relative rounded-full overflow-hidden border-2 border-[#C9A24A] bg-white shadow-md mb-3">
            <Image
              src="/brijwasi-logo.jpg"
              alt={BRIJAWASI_CONFIG.name}
              fill
              sizes="96px"
              className="object-contain p-1"
            />
          </div>

          <h2 className="text-xl font-serif font-bold text-[#701C22] tracking-tight">
            {BRIJAWASI_CONFIG.name}
          </h2>
          <p className="text-xs font-semibold text-[#C9A24A] tracking-wider uppercase mb-3">
            {BRIJAWASI_CONFIG.tagline}
          </p>

          {/* High-Resolution QR Code */}
          <div className="bg-white p-3 rounded-lg border-2 border-[#C9A24A]/60 inline-block shadow-md my-2">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="Scan to Review"
                className="w-44 h-44 object-contain mx-auto"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center bg-[#FFF9EF] text-xs text-[#701C22]">
                Generating QR...
              </div>
            )}
          </div>

          {/* NFC & QR Instructions */}
          <div className="mt-3 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#701C22] text-[#FFF9EF] text-xs font-bold">
              <Smartphone className="w-3.5 h-3.5 text-[#C9A24A]" />
              <span>Tap NFC Card or Scan QR</span>
            </div>
            <p className="text-[11px] font-medium text-[#342019]/80 pt-1">
              Share your dining feedback and Google review in under 30 seconds
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#C9A24A]/30 text-[10px] text-[#342019]/60 break-all font-mono">
            {permanentUrl}
          </div>
        </div>

        {/* Helpful Tip */}
        <p className="text-[11px] text-[#FFF3DB]/70 text-center mt-4">
          Tip: Place this acrylic standee on dining tables or at the payment counter.
        </p>
      </div>
    </div>
  );
}
