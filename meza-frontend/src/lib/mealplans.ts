import { api } from "./api";
import type { OnboardingData } from "../types";

export interface MealPlanStatus {
  id: string;
  status: "pending" | "generating" | "ready" | "failed";
  error_message: string;
  prompt: string;
  week_start_date: string;
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