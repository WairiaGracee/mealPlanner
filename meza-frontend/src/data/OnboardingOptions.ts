import type {
  Allergy,
  Budget,
  CookingTime,
  DietStyle,
  Goal,
  HouseholdSize,
} from "../types";

export interface OptionDef<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon: string;
}

export const GOAL_OPTIONS: OptionDef<Goal>[] = [
  { value: "lose_weight", label: "Lose weight", icon: "◐", description: "Portion-aware Kenyan meals" },
  { value: "eat_healthier", label: "Eat healthier", icon: "✦", description: "More veg, less processed food" },
  { value: "manage_condition", label: "Manage a health goal", icon: "✚", description: "e.g. blood sugar, blood pressure" },
  { value: "gain_muscle", label: "Gain muscle", icon: "▲", description: "Higher protein, bigger portions" },
  { value: "save_money", label: "Save money", icon: "◆", description: "Budget-friendly meal plans" },
];

export const HOUSEHOLD_OPTIONS: OptionDef<HouseholdSize>[] = [
  { value: "solo", label: "Just me", icon: "1" },
  { value: "couple", label: "Me + partner", icon: "2" },
  { value: "family_small", label: "Family (3–4)", icon: "3–4" },
  { value: "family_large", label: "Family (5+)", icon: "5+" },
];

export const DIET_OPTIONS: OptionDef<DietStyle>[] = [
  { value: "no_restrictions", label: "No restrictions", icon: "✓" },
  { value: "vegetarian", label: "Vegetarian", icon: "🌱" },
  { value: "vegan", label: "Vegan", icon: "🌿" },
  { value: "halal", label: "Halal", icon: "☾" },
  { value: "low_carb", label: "Low-carb", icon: "◈" },
];

export const ALLERGY_OPTIONS: OptionDef<Allergy>[] = [
  { value: "none", label: "None", icon: "✓" },
  { value: "nuts", label: "Nuts", icon: "🥜" },
  { value: "dairy", label: "Dairy", icon: "🥛" },
  { value: "gluten", label: "Gluten", icon: "🌾" },
  { value: "eggs", label: "Eggs", icon: "🥚" },
  { value: "shellfish", label: "Shellfish", icon: "🦐" },
  { value: "soy", label: "Soy", icon: "🫘" },
];

export const COOKING_TIME_OPTIONS: OptionDef<CookingTime>[] = [
  { value: "15_20", label: "15–20 min", icon: "◔", description: "Quick, minimal prep" },
  { value: "30_45", label: "30–45 min", icon: "◑", description: "Standard home cooking" },
  { value: "45_60", label: "45–60 min", icon: "◕", description: "Room for more involved dishes" },
  { value: "60_plus", label: "60+ min", icon: "●", description: "I enjoy taking my time" },
];

export const BUDGET_OPTIONS: OptionDef<Budget>[] = [
  { value: "budget", label: "Budget-friendly", icon: "◆", description: "Keep costs as low as possible" },
  { value: "moderate", label: "Moderate", icon: "◆◆", description: "Balance cost and variety" },
  { value: "flexible", label: "Flexible", icon: "◆◆◆", description: "Cost isn't a big constraint" },
];