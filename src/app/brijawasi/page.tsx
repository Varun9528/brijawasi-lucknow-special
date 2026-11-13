import type { Metadata } from "next";
import BrijawasiLucknowSpecialPage, {
  metadata as brijawasiMetadata,
  viewport as brijawasiViewport,
} from "../brijawasi-lucknow-special/page";

export const metadata: Metadata = brijawasiMetadata;
export const viewport = brijawasiViewport;

export default function BrijawasiShortAliasPage() {
  return <BrijawasiLucknowSpecialPage />;
}

