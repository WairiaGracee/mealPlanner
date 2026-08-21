import { api } from "./api";

export type ThemePreset = "nourish" | "bloom" | "fresh" | "heritage" | "midnight" | "";
export type ColorMood = "nourish" | "bloom" | "fresh" | "heritage" | "midnight";
export type Typography = "modern" | "friendly" | "elegant" | "minimal";
export type CardStyle = "sharp" | "rounded" | "soft";
export type BackgroundStyle = "pattern" | "warm_pattern" | "plain" | "dark";
export type Density = "compact" | "comfortable" | "spacious";
export type LanguageCode = "en" | "sw" | "ki" | "kam" | "ebu" | "mer" | "teso" | "luy" | "luo";

export interface UserPreferences {
  theme_preset: ThemePreset;
  color_mood: ColorMood;
  typography: Typography;
  card_style: CardStyle;
  background_style: BackgroundStyle;
  density: Density;
  language: LanguageCode;
  updated_at: string;
}

// Everything a named preset sets at once. Picking one of these applies
// all five axes together; tweaking any single axis afterwards clears
// theme_preset back to "" (custom) — the backend does this bookkeeping,
// we just mirror the same shape here.
export const THEME_PRESETS: Record<Exclude<ThemePreset, "">, {
  color_mood: ColorMood;
  typography: Typography;
  card_style: CardStyle;
  background_style: BackgroundStyle;
  density: Density;
}> = {
  nourish: {
    color_mood: "nourish",
    typography: "modern",
    card_style: "rounded",
    background_style: "pattern",
    density: "comfortable",
  },
  bloom: {
    color_mood: "bloom",
    typography: "friendly",
    card_style: "soft",
    background_style: "warm_pattern",
    density: "comfortable",
  },
  fresh: {
    color_mood: "fresh",
    typography: "minimal",
    card_style: "sharp",
    background_style: "plain",
    density: "compact",
  },
  heritage: {
    color_mood: "heritage",
    typography: "elegant",
    card_style: "soft",
    background_style: "warm_pattern",
    density: "spacious",
  },
  midnight: {
    color_mood: "midnight",
    typography: "modern",
    card_style: "rounded",
    background_style: "dark",
    density: "comfortable",
  },
};

export function getPreferences() {
  return api.get<UserPreferences>("/preferences/me/");
}

export function updatePreferences(patch: Partial<UserPreferences>) {
  return api.patch<UserPreferences>("/preferences/me/", patch);
}