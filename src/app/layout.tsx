import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://brijawasi-lucknow-special.vercel.app"
  ),
  title: "Brijawasi Lucknow Special | Royal Taste & Hospitality",
  description:
    "Official customer review and feedback system for Brijawasi Lucknow Special. Authentic Veg Kabab Paratha, Veg Biryani, Rolls, and Royal Lucknowi Hospitality.",
  applicationName: "Brijawasi Review Hub",
  keywords: [
    "Brijawasi Lucknow Special",
    "Veg Kabab Paratha",
    "Veg Biryani",
    "Veg Kabab Roll",
    "Paneer Masala Roll",
    "Lucknow Food",
    "Brijawasi Google Review",
  ],
  authors: [{ name: "Brijawasi Lucknow Special" }],
  icons: {
    icon: "/brijwasi-logo.jpg",
  },
  openGraph: {
    title: "Brijawasi Lucknow Special - Customer Review & Experience",
    description:
      "Tell us about your authentic dining experience and share your review on Google.",
    siteName: "Brijawasi Lucknow Special",
    locale: "en_IN",
    type: "website",
    images: ["/brijwasi-logo.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#701C22",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full bg-[#3B1118] bg-royal-maroon-pattern flex flex-col antialiased selection:bg-[#C9A24A] selection:text-[#3B1118] text-[#FFF9EF]">
        {children}
      </body>
    </html>
  );
}
