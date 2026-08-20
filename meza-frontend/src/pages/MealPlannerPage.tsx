import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ExportMenu from "../components/export/ExportMenu";
import MealPlanExportCard from "../components/export/MealPlanExportCard";
import {
  IconBasket,
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconHeart,
  IconLeaf,
  IconPencil,
  IconRefresh,
  IconSun,
} from "../components/dashboard/icons";
import { useAuth } from "../context/authContext";
import { ApiError } from "../lib/api";
import {
  generateMealPlan,
  getActiveMealPlan,
  getMyProfile,
  goalLabel,
  type MealPlanDetail,
} from "../lib/mealplans";
import { buildDayMealPlans, formatWeekRange, getTodayDayOfWeek } from "../lib/planTransforms";
import type { DayMealPlan } from "../types";

export default function MealPlannerPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<MealPlanDetail | null>(null);
  const [nutritionGoal, setNutritionGoal] = useState("Personalized");
  const [loading, setLoading] = useState(true);
  const [hasNoPlan, setHasNoPlan] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [favorited, setFavorited] = useState<Set<string>>(new Set());
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getActiveMealPlan()
      .then((p) => {
        if (cancelled) return;
        setPlan(p);
        const today = getTodayDayOfWeek(p);
        setExpandedDays(new Set([today ?? 0]));
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setHasNoPlan(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    getMyProfile()
      .then((profile) => {
        if (!cancelled) setNutritionGoal(goalLabel(profile.goal));
      })
      .catch(() => {
        /* non-critical — falls back to "Personalized" */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const userName = user?.full_name?.split(" ")[0] ?? "there";

  function toggleDay(index: number) {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function toggleFavorite(key: string) {
    setFavorited((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function handleRegenerate() {
    if (regenerating) return;
    setRegenerating(true);
    try {
      const newPlan = await generateMealPlan();
      navigate(`/generating/${newPlan.id}`);
    } catch {
      setRegenerating(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout userName={userName}>
        <div className="flex h-64 items-center justify-center text-sm text-inkMuted">
          Loading your meal plan…
        </div>
      </DashboardLayout>
    );
  }

  if (hasNoPlan || !plan) {
    return (
      <DashboardLayout userName={userName}>
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-24 text-center">
          <h1 className="font-display text-2xl text-ink">No meal plan yet</h1>
          <p className="text-sm text-inkMuted">
            Finish onboarding to get your first personalized week of Kenyan meals.
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

  const week = buildDayMealPlans(plan);
  const daysPlanned = week.filter((d) => d.meals.length > 0).length;
  const totalMeals = plan.meals.length;
  const weekRange = formatWeekRange(plan);

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 pt-6 sm:pt-8">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-display text-3xl text-ink">Your meal plan</h1>
            <p className="mt-1 text-sm text-inkMuted">
              Delicious Kenyan meals, planned just for you.
            </p>
            <div className="mt-2 h-[3px] w-14 rounded-full bg-clay" />
          </div>

          <div className="flex flex-wrap items-stretch gap-3">
            <div className="flex items-center divide-x divide-line rounded-2xl border border-line bg-paper px-5 py-3">
              <div className="pr-5 text-center">
                <p className="font-display text-xl text-ink">{daysPlanned}</p>
                <p className="text-[11px] text-inkMuted">Days planned</p>
              </div>
              <div className="px-5 text-center">
                <p className="font-display text-xl text-ink">{totalMeals}</p>
                <p className="text-[11px] text-inkMuted">Meals</p>
              </div>
              <div className="pl-5 text-center">
                <p className="font-display text-xl text-ink">{nutritionGoal}</p>
                <p className="flex items-center justify-center gap-1 text-[11px] text-inkMuted">
                  <IconLeaf className="h-3 w-3 text-forest" />
                  Nutrition goal
                </p>
              </div>
            </div>

            <div className="flex max-w-xs items-center gap-3 rounded-2xl border border-line bg-forest-light/50 px-4 py-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                <IconBasket className="h-5 w-5" />
              </span>
              <p className="text-xs text-ink">
                <strong className="font-robotoCondensed font-medium">
                  Fresh. Local. Nourishing.
                </strong>
                <br />
                Meals crafted with wholesome ingredients you'll love.
              </p>
            </div>
          </div>
        </div>

        {/* Week nav + edit */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-full border border-line bg-paper px-2 py-1.5">
            <button
              disabled
              title="Browsing other weeks is coming soon"
              className="rounded-full p-1.5 text-inkMuted opacity-40"
            >
              <IconChevronLeft className="h-4 w-4" />
            </button>
            <span className="flex items-center gap-2 px-2 text-sm text-ink">
              <IconCalendar className="h-4 w-4 text-forest" />
              {weekRange}
            </span>
            <button
              disabled
              title="Browsing other weeks is coming soon"
              className="rounded-full p-1.5 text-inkMuted opacity-40"
            >
              <IconChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={() => navigate("/onboarding")}
            className="flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-forest-light"
          >
            <IconPencil className="h-4 w-4" />
            Edit plan
          </button>

          <ExportMenu targetRef={exportRef} filename={`meza-meal-plan-${plan.week_start_date}`} />
        </div>

        {/* Week list */}
        <div className="flex flex-col gap-3">
          {week.map((day, index) => (
            <DayRow
              key={day.day}
              day={day}
              expanded={expandedDays.has(index)}
              onToggle={() => toggleDay(index)}
              favorited={favorited}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {/* Footer note */}
        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-line bg-forest-light/40 px-5 py-4 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-sm text-ink">
            <IconLeaf className="h-4 w-4 flex-shrink-0 text-forest" />
            All meals are generated based on your goals, preferences, and available ingredients.
          </p>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex flex-shrink-0 items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-forest-light disabled:opacity-60"
          >
            <IconRefresh className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
            {regenerating ? "Regenerating…" : "Regenerate plan"}
          </button>
        </div>
      </div>

      <MealPlanExportCard ref={exportRef} week={week} weekRange={weekRange} userName={userName} />
    </DashboardLayout>
  );
}

function DayRow({
  day,
  expanded,
  onToggle,
  favorited,
  onToggleFavorite,
}: {
  day: DayMealPlan;
  expanded: boolean;
  onToggle: () => void;
  favorited: Set<string>;
  onToggleFavorite: (key: string) => void;
}) {
  const slots: Array<{ slot: string; label: string }> = [
    { slot: "breakfast", label: "Breakfast" },
    { slot: "lunch", label: "Lunch" },
    { slot: "dinner", label: "Dinner" },
  ];

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors ${
        day.isToday ? "border-forest bg-forest-light/30" : "border-line bg-paper"
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-4 py-3.5 text-left sm:px-5"
      >
        <span className="flex w-16 flex-shrink-0 items-center gap-2 sm:w-20">
          {day.isToday && <IconSun className="h-4 w-4 flex-shrink-0 text-clay" />}
          <span>
            <span className="block font-display text-base text-ink">{day.day}</span>
            <span className="block text-[11px] uppercase tracking-[0.06em] text-inkMuted">
              {day.date}
            </span>
          </span>
        </span>

        {!expanded && (
          <div className="hidden flex-1 items-center gap-6 sm:flex">
            {day.meals.length === 0 ? (
              <span className="text-sm text-inkMuted">No meals planned</span>
            ) : (
              day.meals.map((meal) => (
                <div key={meal.slot} className="flex flex-1 items-center gap-3">
                  <MealThumb meal={meal} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{meal.name}</p>
                    <p className="text-xs text-inkMuted">{meal.kcal} kcal</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <span className="ml-auto flex flex-shrink-0 items-center gap-1">
          {!expanded && (
            <span className="text-xs text-inkMuted sm:hidden">
              {day.meals.length} meal{day.meals.length === 1 ? "" : "s"}
            </span>
          )}
          <IconChevronDown
            className={`h-4 w-4 text-inkMuted transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {expanded && (
        <div className="border-t border-line/70 px-4 pb-4 pt-1 sm:px-5">
          {day.meals.length === 0 ? (
            <p className="py-3 text-sm text-inkMuted">No meals planned for this day.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 pt-3 sm:grid-cols-3">
              {slots.map(({ slot, label }) => {
                const meal = day.meals.find((m) => m.slot === slot);
                if (!meal) return null;
                const key = `${day.day}-${slot}`;
                const isFav = favorited.has(key);
                return (
                  <div
                    key={slot}
                    className="flex items-start gap-3 rounded-xl border border-line/70 bg-paper p-3"
                  >
                    <MealThumb meal={meal} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-forest">
                        {label}
                      </p>
                      <p className="mt-0.5 text-sm font-medium leading-snug text-ink">
                        {meal.name}
                      </p>
                      <p className="mt-0.5 text-xs text-inkMuted">
                        {meal.kcal} kcal · {meal.time}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(key);
                      }}
                      className={`flex-shrink-0 transition-colors ${
                        isFav ? "text-clay" : "text-inkMuted hover:text-clay"
                      }`}
                      aria-label="Favorite this meal"
                    >
                      <IconHeart className="h-4 w-4" fill={isFav ? "currentColor" : "none"} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MealThumb({
  meal,
  size = "sm",
}: {
  meal: DayMealPlan["meals"][number];
  size?: "sm" | "lg";
}) {
  const dims = size === "lg" ? "h-16 w-16" : "h-11 w-11";
  return (
    <div
      className={`flex ${dims} flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-forest-light text-xl`}
    >
      {meal.image ? (
        <img src={meal.image} alt={meal.name} className="h-full w-full object-cover" />
      ) : (
        meal.emoji
      )}
    </div>
  );
}