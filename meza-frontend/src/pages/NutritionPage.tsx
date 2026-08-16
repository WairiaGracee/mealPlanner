import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { IconFlame, IconLeaf, IconTarget } from "../components/dashboard/icons";
import { useAuth } from "../context/authContext";
import { getActiveMealPlan, type MealPlanDetail } from "../lib/mealplans";
import { ApiError } from "../lib/api";
import { macrosForDay, getTodayDayOfWeek, type DayMacros } from "../lib/planTransforms";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEAL_TYPE_ORDER: Record<string, number> = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
const MACRO_COLORS = { protein: "#2F4B33", carbs: "#C79A56", fat: "#B65B3D" };

function buildDonutGradient(macros: DayMacros): string {
  const parts = [
    { key: "protein", grams: macros.protein, kcalPerGram: 4 },
    { key: "carbs", grams: macros.carbs, kcalPerGram: 4 },
    { key: "fat", grams: macros.fat, kcalPerGram: 9 },
  ];
  const kcalParts = parts.map((p) => p.grams * p.kcalPerGram);
  const total = kcalParts.reduce((a, b) => a + b, 0) || 1;

  let cursor = 0;
  const stops = parts.map((p, i) => {
    const pct = (kcalParts[i] / total) * 100;
    const start = cursor;
    cursor += pct;
    return `${MACRO_COLORS[p.key as keyof typeof MACRO_COLORS]} ${start}% ${cursor}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

export default function NutritionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<MealPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasNoPlan, setHasNoPlan] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getActiveMealPlan()
      .then((p) => {
        if (cancelled) return;
        setPlan(p);
        setSelectedDay(getTodayDayOfWeek(p) ?? 0);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setHasNoPlan(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const userName = user?.full_name?.split(" ")[0] ?? "there";

  if (loading) {
    return (
      <DashboardLayout userName={userName}>
        <div className="flex h-64 items-center justify-center text-sm text-inkMuted">
          Loading nutrition data…
        </div>
      </DashboardLayout>
    );
  }

  if (hasNoPlan || !plan) {
    return (
      <DashboardLayout userName={userName}>
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-24 text-center">
          <h1 className="font-display text-2xl text-ink">No nutrition data yet</h1>
          <p className="text-sm text-inkMuted">
            Finish onboarding to get a meal plan with nutrition estimates.
          </p>
          <button
            onClick={() => navigate("/onboarding")}
            className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
          >
            Start onboarding
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const macros = macrosForDay(plan, selectedDay);
  const dayMeals = plan.meals
    .filter((m) => m.day_of_week === selectedDay)
    .sort((a, b) => (MEAL_TYPE_ORDER[a.meal_type] ?? 9) - (MEAL_TYPE_ORDER[b.meal_type] ?? 9));
  const hasMacroData = macros.protein > 0 || macros.carbs > 0 || macros.fat > 0;

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6 pt-6 sm:pt-8">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-display text-3xl text-ink">Nutrition</h1>
            <p className="mt-1 text-sm text-inkMuted">
              A daily breakdown of calories and macros from your meal plan.
            </p>
            <div className="mt-2 h-[3px] w-14 rounded-full bg-clay" />
          </div>

          <div className="flex flex-wrap items-stretch gap-3">
            <div className="flex items-center divide-x divide-line rounded-2xl border border-line bg-paper px-5 py-3">
              <div className="pr-5 text-center">
                <p className="font-display text-xl text-ink">
                  {hasMacroData ? Math.round(macros.kcal) : "—"}
                </p>
                <p className="flex items-center justify-center gap-1 text-[11px] text-inkMuted">
                  <IconFlame className="h-3 w-3 text-clay" />
                  Kcal this day
                </p>
              </div>
              <div className="pl-5 text-center">
                <p className="font-display text-xl text-ink">{dayMeals.length}</p>
                <p className="flex items-center justify-center gap-1 text-[11px] text-inkMuted">
                  <IconTarget className="h-3 w-3 text-forest" />
                  Meals planned
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Day pill nav */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-line bg-paper px-2 py-1.5">
          {DAY_LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => setSelectedDay(i)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                i === selectedDay
                  ? "bg-forest text-offwhite"
                  : "text-ink/80 hover:bg-forest-light"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
          {!hasMacroData ? (
            <p className="text-sm text-inkMuted">
              No macro estimates for this day yet — this plan may have been generated before
              nutrition tracking was added. Generate a new plan to see macros here.
            </p>
          ) : (
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div
                className="relative flex h-40 w-40 flex-shrink-0 items-center justify-center rounded-full"
                style={{ background: buildDonutGradient(macros) }}
              >
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-paper text-center">
                  <span className="font-display text-2xl text-ink">{Math.round(macros.kcal)}</span>
                  <span className="text-[11px] text-inkMuted">kcal</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                <MacroRow label="Protein" grams={macros.protein} color={MACRO_COLORS.protein} />
                <MacroRow label="Carbs" grams={macros.carbs} color={MACRO_COLORS.carbs} />
                <MacroRow label="Fat" grams={macros.fat} color={MACRO_COLORS.fat} />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-display text-lg text-ink">
            <IconLeaf className="h-4 w-4 text-forest" />
            Meals this day
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {dayMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center gap-4 rounded-xl border border-line/70 p-3 transition-colors hover:bg-forest-light/30"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-forest-light text-xl">
                  {meal.recipe.emoji || "🍽️"}
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest">
                    {meal.meal_type}
                  </p>
                  <p className="mt-0.5 font-medium text-ink">{meal.recipe.name}</p>
                  <p className="mt-0.5 text-xs text-inkMuted">
                    {meal.recipe.calories ?? 0} kcal
                    {meal.recipe.protein_g != null ? ` · ${Math.round(meal.recipe.protein_g)}g protein` : ""}
                    {meal.recipe.carbs_g != null ? ` · ${Math.round(meal.recipe.carbs_g)}g carbs` : ""}
                    {meal.recipe.fat_g != null ? ` · ${Math.round(meal.recipe.fat_g)}g fat` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function MacroRow({ label, grams, color }: { label: string; grams: number; color: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-ink">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </span>
      <span className="text-inkMuted">{Math.round(grams)}g</span>
    </div>
  );
}