import type { Metadata } from "next";
import BrijawasiReviewHub from "@/components/brijawasi/BrijawasiReviewHub";

export const metadata: Metadata = {
  title: "Write a Google Review | Brajwasi Lucknow Special",
  description:
    "Share your dining experience for Brajwasi Lucknow Special. Rate dishes and generate your Google review in seconds.",
};

export default function ReviewPage() {
  return (
    <main className="min-h-screen w-full flex flex-col justify-start items-center bg-[#3B1118]">
      <BrijawasiReviewHub initialView="review" />
    </main>
  );
}
