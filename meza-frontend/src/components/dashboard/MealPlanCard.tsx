import { useState } from "react";
import type { DayMealPlan } from "../../types";
import { IconArrowRight, IconCalendar, IconChevronRight, IconPlus } from "./icons";

interface MealPlanCardProps {
  week: DayMealPlan[];
}

const FULL_DAY_NAMES: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

export default function MealPlanCard({ week }: MealPlanCardProps) {
  const todayIndex = Math.max(
    0,
    week.findIndex((d) => d.isToday)
  );
  const [activeIndex, setActiveIndex] = useState(todayIndex);
  const active = week[activeIndex];

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Your meal plan</h2>
        <button className="flex items-center gap-1 text-sm font-medium text-ink/80 transition-colors hover:text-forest">
          This week
          <IconArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {week.map((day, i) => (
          <button
            key={day.day}
            onClick={() => setActiveIndex(i)}
            className={`flex flex-shrink-0 flex-col items-center gap-1.5 rounded-xl px-3.5 py-2 text-center transition-colors ${
              i === activeIndex
                ? "bg-forest text-offwhite"
                : "text-ink/80 hover:bg-forest-light"
            }`}
          >
            <span className="text-sm font-medium">{day.day}</span>
            <span
              className={`text-[11px] ${
                i === activeIndex ? "text-offwhite/70" : "text-inkMuted"
              }`}
            >
              {day.date}
            </span>
            <span
              className={`h-1 w-1 rounded-full ${
                i === activeIndex ? "bg-offwhite" : "bg-transparent"
              }`}
            />
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-forest-light/50 p-4 sm:p-5">
        <div className="flex items-center gap-2 rounded-xl bg-forest-light px-3 py-2 text-xs font-medium uppercase tracking-[0.08em] text-forest-deep">
          <IconCalendar className="h-4 w-4" />
          Today · {FULL_DAY_NAMES[active.day] ?? active.day}, {active.date}
        </div>

        <div className="mt-4 flex flex-col">
          {active.meals.map((meal, i) => (
            <div key={meal.slot} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className="whitespace-nowrap rounded-full bg-paper px-2 py-1 text-[11px] font-medium text-inkMuted">
                  {meal.time}
                </span>
                {i < active.meals.length - 1 && (
                  <span className="my-1 min-h-[2.25rem] w-px flex-1 bg-line" />
                )}
              </div>

              <div className="mb-3 flex flex-1 items-center gap-3 rounded-xl border border-line bg-paper p-3">
                <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-forest-light text-2xl">
                  <span aria-hidden="true">{meal.emoji}</span>
                  {meal.image && (
                    <img
                      src={meal.image}
                      alt={meal.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest">
                    {meal.label}
                  </p>
                  <p className="mt-0.5 font-medium text-ink">{meal.name}</p>
                  <p className="mt-0.5 text-xs text-inkMuted">
                    {meal.kcal} kcal · {meal.time}
                  </p>
                </div>

                <IconChevronRight className="h-4 w-4 flex-shrink-0 text-inkMuted" />
              </div>
            </div>
          ))}
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-full bg-forest-light py-2.5 text-sm font-medium text-forest-deep transition-colors hover:bg-paper">
          <IconPlus className="h-4 w-4" />
          Add snack
        </button>
      </div>
    </div>
  );
}