import type { DayMealPlan, RecipeSummary, UpcomingMeal } from "../types";
import type { MealPlanDetail, Recipe } from "./mealplans";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const MEAL_TYPE_ORDER: Record<string, number> = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
const MEAL_TYPE_TIME: Record<string, string> = {
  breakfast: "8:00 AM",
  lunch: "1:00 PM",
  dinner: "7:00 PM",
  snack: "4:00 PM",
};
const MEAL_TYPE_LABEL: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};
const FALLBACK_EMOJI = "🍽️";

function parseWeekStart(weekStartDate: string): Date {
  const [y, m, d] = weekStartDate.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatShortDate(date: Date): string {
  return `${MONTH_LABELS[date.getMonth()]} ${date.getDate()}`;
}

function formatDayAndDate(date: Date): string {
  return `${DAY_LABELS[(date.getDay() + 6) % 7]}, ${formatShortDate(date)}`;
}

export function buildDayMealPlans(detail: MealPlanDetail): DayMealPlan[] {
  const weekStart = parseWeekStart(detail.week_start_date);
  const today = new Date();

  return DAY_LABELS.map((dayLabel, dayOfWeek) => {
    const date = addDays(weekStart, dayOfWeek);
    const meals = detail.meals
      .filter((m) => m.day_of_week === dayOfWeek)
      .sort((a, b) => (MEAL_TYPE_ORDER[a.meal_type] ?? 9) - (MEAL_TYPE_ORDER[b.meal_type] ?? 9))
      .map((m) => ({
        slot: m.meal_type,
        label: MEAL_TYPE_LABEL[m.meal_type] ?? m.meal_type,
        time: MEAL_TYPE_TIME[m.meal_type] ?? "",
        name: m.recipe.name,
        kcal: m.recipe.calories ?? 0,
        emoji: m.recipe.emoji || FALLBACK_EMOJI,
        image: m.recipe.image_url || undefined,
      }));

    return {
      day: dayLabel,
      date: formatShortDate(date),
      isToday: isSameDate(date, today),
      meals,
    };
  });
}

export function buildUpcomingMeals(detail: MealPlanDetail, limit = 3): UpcomingMeal[] {
  const weekStart = parseWeekStart(detail.week_start_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const flattened = detail.meals
    .map((m) => ({
      date: addDays(weekStart, m.day_of_week),
      meal_type: m.meal_type,
      recipe: m.recipe,
    }))
    .sort((a, b) => {
      const dateDiff = a.date.getTime() - b.date.getTime();
      if (dateDiff !== 0) return dateDiff;
      return (MEAL_TYPE_ORDER[a.meal_type] ?? 9) - (MEAL_TYPE_ORDER[b.meal_type] ?? 9);
    });

  const upcoming = flattened.filter((m) => m.date.getTime() >= today.getTime());
  const source = upcoming.length > 0 ? upcoming : flattened;

  return source.slice(0, limit).map((m) => ({
    name: m.recipe.name,
    day: formatDayAndDate(m.date),
    slot: MEAL_TYPE_LABEL[m.meal_type] ?? m.meal_type,
    emoji: m.recipe.emoji || FALLBACK_EMOJI,
    image: m.recipe.image_url || undefined,
  }));
}

export function buildRecipeSummaries(recipes: Recipe[]): RecipeSummary[] {
  return recipes.map((r) => ({
    name: r.name,
    minutes: r.prep_minutes ?? 0,
    emoji: r.emoji || FALLBACK_EMOJI,
    image: r.image_url || "",
  }));
}
export function todaysCalories(detail: MealPlanDetail): number {
  const weekStart = parseWeekStart(detail.week_start_date);
  const today = new Date();
  const todayIndex = detail.meals.findIndex((m) =>
    isSameDate(addDays(weekStart, m.day_of_week), today)
  );
  if (todayIndex === -1) return 0;

  const todayDayOfWeek = detail.meals[todayIndex].day_of_week;
  return detail.meals
    .filter((m) => m.day_of_week === todayDayOfWeek)
    .reduce((sum, m) => sum + (m.recipe.calories ?? 0), 0);
}

export interface DayMacros {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function macrosForDay(detail: MealPlanDetail, dayOfWeek: number): DayMacros {
  return detail.meals
    .filter((m) => m.day_of_week === dayOfWeek)
    .reduce(
      (acc, m) => ({
        kcal: acc.kcal + (m.recipe.calories ?? 0),
        protein: acc.protein + (m.recipe.protein_g ?? 0),
        carbs: acc.carbs + (m.recipe.carbs_g ?? 0),
        fat: acc.fat + (m.recipe.fat_g ?? 0),
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    );
}

export function formatWeekRange(detail: MealPlanDetail): string {
  const weekStart = parseWeekStart(detail.week_start_date);
  const weekEnd = addDays(weekStart, 6);
  const sameMonth = weekStart.getMonth() === weekEnd.getMonth();
  const startStr = formatShortDate(weekStart);
  const endStr = sameMonth
    ? `${weekEnd.getDate()}`
    : formatShortDate(weekEnd);
  return `${startStr} – ${endStr}, ${weekEnd.getFullYear()}`;
}

export function getTodayDayOfWeek(detail: MealPlanDetail): number | null {
  const weekStart = parseWeekStart(detail.week_start_date);
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    if (isSameDate(addDays(weekStart, i), today)) return i;
  }
  return null;
}