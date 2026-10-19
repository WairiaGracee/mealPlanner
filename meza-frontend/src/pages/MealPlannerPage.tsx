import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ExportMenu from "../components/export/ExportMenu";
import MealPlanExportCard from "../components/export/MealPlanExportCard";
import {
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconHeart,
  IconLeaf,
  IconPencil,
  IconRefresh,
} from "../components/dashboard/icons";
import { IconForkSpoon } from "../components/dashboard/extraicons";
import { ACCENT } from "../components/dashboard/accents";
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
import type { DayMeal, DayMealPlan } from "../types";

/* ---------- small helpers ---------- */

const SLOT_ACCENT = {
  breakfast: ACCENT.rose,
  lunch: ACCENT.peach,
  dinner: ACCENT.lavender,
  snack: ACCENT.sage,
} as const;

function slotAccent(slot: string) {
  return SLOT_ACCENT[slot as keyof typeof SLOT_ACCENT] ?? ACCENT.sage;
}

function prettyTag(tag?: string): string | null {
  if (!tag) return null;
  const s = tag.replace(/[-_]+/g, " ").trim().toLowerCase();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : null;
}

function tagAccent(tag: string) {
  const k = tag.toLowerCase();
  if (k.includes("protein")) return ACCENT.rose;
  if (k.includes("fib")) return ACCENT.sage;
  if (k.includes("iron") || k.includes("energy")) return ACCENT.peach;
  return ACCENT.lavender;
}

/** The tag most of the day's meals share (ties go to the earliest meal). */
function dayTag(day: DayMealPlan): string | null {
  const counts = new Map<string, number>();
  for (const m of day.meals) {
    const t = prettyTag(m.tag);
    if (t) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  let best: string | null = null;
  let bestCount = 0;
  counts.forEach((count, tag) => {
    if (count > bestCount) {
      best = tag;
      bestCount = count;
    }
  });
  return best;
}

function daysIntoWeek(weekStartDate: string): number {
  const [y, m, d] = weekStartDate.split("-").map(Number);
  const start = new Date(y, m - 1, d);
  const diff = Math.floor((Date.now() - start.getTime()) / 86_400_000);
  return Math.max(0, Math.min(7, diff + 1));
}

/* ---------- page ---------- */

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
  const daysIn = daysIntoWeek(plan.week_start_date);

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-6xl flex-col gap-5 pt-0">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="lg:pt-2">
            <h1 className="font-display text-3xl text-ink sm:text-4xl">Your meal plan</h1>
            <p className="mt-1 text-sm text-inkMuted">
              Delicious Kenyan meals, planned just for you.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-forest-light">
                <div
                  className="h-full rounded-full bg-forest transition-all duration-700"
                  style={{ width: `${(daysIn / 7) * 100}%` }}
                />
              </div>
              <span className="text-xs text-inkMuted">{daysIn} of 7 days</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 lg:max-w-[460px]">
            <div className="grid grid-cols-3 gap-3">
              <StatCard icon={<IconCalendar className="h-5 w-5" />} value={String(daysPlanned)} label="Days planned" />
              <StatCard icon={<IconForkSpoon className="h-5 w-5" />} value={String(totalMeals)} label="Meals" />
              <StatCard icon={<IconLeaf className="h-5 w-5" />} value={nutritionGoal} label="Nutrition goal" />
            </div>

            <button
              onClick={() => navigate("/recipes")}
              className="flex items-center gap-3 rounded-2xl border border-line bg-forest-light/60 px-4 py-3 text-left transition-colors hover:bg-forest-light"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-paper text-forest">
                <IconHeart className="h-4 w-4" />
              </span>
              <p className="flex-1 text-xs text-inkMuted">
                <strong className="block text-sm font-medium text-ink">Fresh, local, nourishing.</strong>
                Meals crafted with wholesome ingredients you'll love.
              </p>
              <IconChevronRight className="h-4 w-4 flex-shrink-0 text-inkMuted" />
            </button>
          </div>
        </div>

        {/* Week nav + actions */}
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/onboarding")}
              className="flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-forest-light"
            >
              <IconPencil className="h-4 w-4" />
              Edit plan
            </button>
            <ExportMenu solid targetRef={exportRef} filename={`meza-meal-plan-${plan.week_start_date}`} />
          </div>
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
        <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-line bg-forest-light/50 px-5 py-3 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-xs text-inkMuted sm:text-sm">
            <IconLeaf className="h-4 w-4 flex-shrink-0 text-forest" />
            Meals are planned around your goals, preferences, and available ingredients.
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

/* ---------- pieces ---------- */

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
      <span className="flex-shrink-0 text-forest">{icon}</span>
      <div className="min-w-0">
        <p className="truncate font-display text-lg font-semibold leading-tight text-ink">{value}</p>
        <p className="truncate text-[11px] text-inkMuted">{label}</p>
      </div>
    </div>
  );
}

function TagPill({ tag }: { tag: string }) {
  const a = tagAccent(tag);
  return (
    <span
      className="inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: a.bg, color: a.ink }}
    >
      {tag}
    </span>
  );
}

function MealLetter({ meal }: { meal: DayMeal }) {
  const a = slotAccent(meal.slot);
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-display text-base font-semibold"
      style={{ backgroundColor: a.bg, color: a.ink }}
    >
      {meal.label.charAt(0)}
    </span>
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
  const tag = dayTag(day);

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors ${
        expanded ? "border-line bg-forest-light/40" : "border-line bg-paper hover:bg-forest-light/20"
      } ${day.isToday ? "ring-1 ring-forest/30" : ""}`}
    >
      <button onClick={onToggle} className="flex w-full items-center gap-4 px-4 py-3.5 text-left sm:px-5">
        <span className="block w-14 flex-shrink-0 sm:w-16">
          <span className="block font-display text-lg leading-tight text-ink">{day.day}</span>
          <span className="block text-[11px] uppercase tracking-[0.06em] text-inkMuted">{day.date}</span>
        </span>

        {expanded ? (
          <>
            <span className="hidden h-8 w-px bg-line sm:block" />
            {tag && <TagPill tag={tag} />}
          </>
        ) : (
          <div className="hidden flex-1 items-stretch sm:flex">
            {day.meals.length === 0 ? (
              <span className="text-sm text-inkMuted">No meals planned</span>
            ) : (
              day.meals.map((meal, i) => (
                <div
                  key={meal.slot}
                  className={`min-w-0 flex-1 ${i > 0 ? "ml-4 border-l border-line pl-4" : ""}`}
                >
                  <p className="truncate text-xs font-medium text-ink">{meal.name}</p>
                  <p className="text-[11px] text-inkMuted">{meal.kcal} kcal</p>
                </div>
              ))
            )}
          </div>
        )}

        <span className="ml-auto flex flex-shrink-0 items-center gap-3">
          {!expanded && tag && <TagPill tag={tag} />}
          {!expanded && (
            <span className="text-xs text-inkMuted sm:hidden">
              {day.meals.length} meal{day.meals.length === 1 ? "" : "s"}
            </span>
          )}
          {expanded ? (
            <IconChevronDown className="h-4 w-4 rotate-180 text-inkMuted" />
          ) : (
            <IconChevronRight className="h-4 w-4 text-inkMuted" />
          )}
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 sm:px-5">
          {day.meals.length === 0 ? (
            <p className="py-3 text-sm text-inkMuted">No meals planned for this day.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {day.meals.map((meal) => {
                const key = `${day.day}-${meal.slot}`;
                const isFav = favorited.has(key);
                const mealTag = prettyTag(meal.tag);
                return (
                  <div
                    key={meal.slot}
                    className="relative flex gap-3 rounded-xl border border-line bg-paper p-4"
                  >
                    <MealLetter meal={meal} />
                    <div className="flex min-w-0 flex-1 flex-col pr-5">
                      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-inkMuted">
                        {meal.label}
                      </p>
                      <p className="mt-1 text-sm font-medium leading-snug text-ink">{meal.name}</p>
                      {mealTag && (
                        <div className="mt-2">
                          <TagPill tag={mealTag} />
                        </div>
                      )}
                      <p className="mt-3 text-xs text-inkMuted">
                        {meal.kcal} kcal · {meal.time}
                      </p>
                    </div>
                    <button
                      onClick={() => onToggleFavorite(key)}
                      className={`absolute right-3 top-3 transition-colors ${
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