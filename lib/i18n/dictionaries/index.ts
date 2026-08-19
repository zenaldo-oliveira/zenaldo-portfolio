import { en } from "@/lib/i18n/dictionaries/en";
import { es } from "@/lib/i18n/dictionaries/es";
import { pt } from "@/lib/i18n/dictionaries/pt";
import type { Dictionary, LanguageCode } from "@/lib/i18n/types";

export const dictionaries: Record<LanguageCode, Dictionary> = { pt, en, es };
