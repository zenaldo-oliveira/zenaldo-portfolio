import type { StaticImageData } from "next/image";
import type { OfferMedia } from "@/lib/catalog/data";
import barberShot from "@/public/projects/screenshots/barber-shop-premium.webp";
import petShopShot from "@/public/projects/screenshots/pet-shop-premium.webp";
import textToVoiceShot from "@/public/projects/screenshots/text-to-voice-ai.webp";

type ScreenshotFile = Extract<OfferMedia, { kind: "screenshot" }>["file"];

// Capturas reais (public/projects/screenshots) usadas pelas ofertas do
// catálogo e pela vitrine do Hero.
export const OFFER_SCREENSHOTS: Record<ScreenshotFile, StaticImageData> = {
  "pet-shop-premium": petShopShot,
  "barber-shop-premium": barberShot,
  "text-to-voice-ai": textToVoiceShot,
};
