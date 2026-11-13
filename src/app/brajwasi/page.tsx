import type { Metadata } from "next";
import BrajwasiLucknowSpecialPage, {
  metadata as brajwasiMetadata,
  viewport as brajwasiViewport,
} from "../brijawasi-lucknow-special/page";

export const metadata: Metadata = brajwasiMetadata;
export const viewport = brajwasiViewport;

export default function BrajwasiPage() {
  return <BrajwasiLucknowSpecialPage />;
}
