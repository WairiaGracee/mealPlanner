import { useState } from "react";
import type { DayMealPlan } from "../../types";
import { IconArrowRight } from "./icons";

interface MealPlanCardProps {
  week: DayMealPlan[];
}

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
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            aria-label="Previous day"
            className="flex h-7 w-7 items-center justify-center rounded-full text-inkMuted transition-colors hover:bg-forest-light hover:text-ink"
          >
            <IconArrowRight className="h-4 w-4 rotate-180" />
          </button>
          <button
            onClick={() => setActiveIndex((i) => Math.min(week.length - 1, i + 1))}
            aria-label="Next day"
            className="flex h-7 w-7 items-center justify-center rounded-full text-inkMuted transition-colors hover:bg-forest-light hover:text-ink"
          >
            <IconArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {week.map((day, i) => (
          <button
            key={day.day}
            onClick={() => setActiveIndex(i)}
            className={`flex flex-shrink-0 flex-col items-center rounded-xl px-3.5 py-2 text-center transition-colors ${
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
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {active.meals.map((meal) => (
          <div
            key={meal.slot}
            className="flex items-center gap-4 rounded-xl border border-line p-3"
          >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-forest-light text-2xl">
              {meal.image ? (
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                meal.emoji
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

            <button
              aria-label="More options"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-inkMuted transition-colors hover:bg-forest-light hover:text-ink"
            >
              ⋯
            </button>
          </div>
        ))}
      </div>

      <button className="mt-5 w-full rounded-full border border-line py-2.5 text-sm font-medium text-ink transition-colors hover:bg-forest-light">
        View full plan
      </button>
    </div>
  );
}