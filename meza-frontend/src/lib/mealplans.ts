import { api } from "./api";
import type { OnboardingData } from "../types";

export interface MealPlanStatus {
  id: string;
  status: "pending" | "generating" | "ready" | "failed";
  error_message: string;
  prompt: string;
  week_start_date: string;
}

export interface Recipe {
  id: string;
  name: string;
  region: string;
  description: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  prep_minutes: number | null;
  image_url: string;
  emoji: string;
  ingredients: { name: string; quantity: string; unit?: string }[];
  steps: string[];
  tags: string[];
}

export interface PlannedMeal {
  id: string;
  day_of_week: number;
  day_of_week_display: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  recipe: Recipe;
}

export interface GroceryListItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  is_checked: boolean;
}

export interface MealPlanDetail {
  id: string;
  status: MealPlanStatus["status"];
  week_start_date: string;
  is_active: boolean;
  prompt: string;
  meals: PlannedMeal[];
  grocery_items: GroceryListItem[];
  created_at: string;
}

function toKg(weight: string, unit: "kg" | "lb"): number | null {
  const n = parseFloat(weight);
  if (isNaN(n)) return null;
  return unit === "lb" ? Math.round(n * 0.453592 * 10) / 10 : n;
}

function toCm(height: string, unit: "cm" | "ft"): number | null {
  const n = parseFloat(height);
  if (isNaN(n)) return null;
  return unit === "ft" ? Math.round(n * 30.48 * 10) / 10 : n;
}

export function submitOnboardingProfile(data: OnboardingData) {
  return api.patch("/profile/me/", {
    goal: data.goal,
    household: data.household,
    diet_style: data.dietStyle,
    allergies: data.allergies,
    cooking_time: data.cookingTime,
    budget: data.budget,
    weight_kg: data.weight ? toKg(data.weight, data.weightUnit) : null,
    height_cm: data.height ? toCm(data.height, data.heightUnit) : null,
    onboarding_completed: true,
  });
}

export function generateMealPlan() {
  return api.post<MealPlanStatus>("/mealplans/generate/");
}

export function getMealPlanStatus(id: string) {
  return api.get<MealPlanStatus>(`/mealplans/${id}/status/`);
}

export function getMealPlanDetail(id: string) {
  return api.get<MealPlanDetail>(`/mealplans/${id}/`);
}

export function getRecipes() {
  return api.get<Recipe[]>("/mealplans/recipes/");
}

export function getRecipe(id: string) {
  return api.get<Recipe>(`/mealplans/recipes/${id}/`);
}

export function getActiveMealPlan() {
  return api.get<MealPlanDetail>("/mealplans/active/");
}
export interface Profile {
  id: string;
  goal: string;
  household: string;
  diet_style: string;
  allergies: string[];
  cooking_time: string;
  budget: string;
  weight_kg: number | null;
  height_cm: number | null;
  onboarding_completed: boolean;
}

const GOAL_LABELS: Record<string, string> = {
  lose_weight: "Weight loss",
  eat_healthier: "Balanced",
  manage_condition: "Condition-friendly",
  gain_muscle: "High protein",
  save_money: "Budget-friendly",
};

export function getMyProfile() {
  return api.get<Profile>("/profile/me/");
}

export function goalLabel(goal: string): string {
  return GOAL_LABELS[goal] ?? "Personalized";
}

export function toggleGroceryItem(id: string, isChecked: boolean) {
  return api.patch<GroceryListItem>(`/mealplans/grocery-items/${id}/`, {
    is_checked: isChecked,
  });
}