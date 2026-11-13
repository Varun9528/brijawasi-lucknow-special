import type { Metadata, Viewport } from "next";
import BrijawasiReviewHub from "@/components/brijawasi/BrijawasiReviewHub";

export const metadata: Metadata = {
  title: "Brijawasi Lucknow Special | Share Your Dining Experience",
  description:
    "Official customer review and feedback system for Brijawasi Lucknow Special. Authentic Veg Kabab Paratha, Veg Biryani, and Royal Lucknowi Hospitality.",
  applicationName: "Brijawasi Review Hub",
  keywords: [
    "Brijawasi Lucknow Special",
    "Veg Kabab Paratha",
    "Veg Biryani",
    "Brijawasi Google Review",
  ],
  authors: [{ name: "Brijawasi Lucknow Special" }],
  icons: {
    icon: "/brijwasi-logo.jpg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#701C22",
};

export default function BrijawasiLucknowSpecialPage() {
  return (
    <main className="min-h-screen w-full flex flex-col justify-start items-center bg-[#3B1118]">
      <BrijawasiReviewHub />
    </main>
  );
}
