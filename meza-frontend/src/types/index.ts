export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image?: string;
  tag: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

export type ShowcaseTabId = "plan" | "recipe" | "shop" | "remind";

export interface MealPlanPreview {
  id: string;
  slug: string;
  name: string;
  tag: string;
  region: string;
  description: string;
  calories: string;
  prepTime: string;
  /** Optional — falls back to a gradient placeholder if not provided */
  image?: string;
}

export interface DishFeature {
  id: string;
  name: string;
  swahiliNote: string;
  region: string;
}

export interface Step {
  id: string;
  number: string;
  title: string;
  description: string;
}
export type Goal =
  | "lose_weight"
  | "eat_healthier"
  | "manage_condition"
  | "gain_muscle"
  | "save_money";

export type HouseholdSize = "solo" | "couple" | "family_small" | "family_large";

export type DietStyle =
  | "no_restrictions"
  | "vegetarian"
  | "vegan"
  | "halal"
  | "low_carb";

export type Allergy =
  | "none"
  | "nuts"
  | "dairy"
  | "gluten"
  | "eggs"
  | "shellfish"
  | "soy";

export type CookingTime = "15_20" | "30_45" | "45_60" | "60_plus";

export type Budget = "budget" | "moderate" | "flexible";

export type WeightUnit = "kg" | "lb";
export type HeightUnit = "cm" | "ft";

export interface OnboardingData {
  goal: Goal | null;
  household: HouseholdSize | null;
  dietStyle: DietStyle | null;
  allergies: Allergy[];
  cookingTime: CookingTime | null;
  budget: Budget | null;
  weight: string;
  weightUnit: WeightUnit;
  height: string;
  heightUnit: HeightUnit;
}

export const EMPTY_ONBOARDING_DATA: OnboardingData = {
  goal: null,
  household: null,
  dietStyle: null,
  allergies: [],
  cookingTime: null,
  budget: null,
  weight: "",
  weightUnit: "kg",
  height: "",
  heightUnit: "cm",
};
export type MealSlot = "breakfast" | "lunch" | "dinner";

export interface TodayMeal {
  slot: MealSlot;
  time: string;
  name: string;
  kcal: number;
  minutes: number;
  emoji: string;
}

export interface DayPlan {
  day: string;
  isToday?: boolean;
  meals: string[];
}

export interface ShoppingCategory {
  name: string;
  items: string[];
}

export interface ProgressStat {
  label: string;
  value: number;
  target: number;
  unit?: string;
  icon: string;
}

export interface ChecklistItem {
  label: string;
  done: boolean;
}

export interface RecipeSummary {
  name: string;
  minutes: number;
  emoji: string;
}