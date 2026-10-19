import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DayMealPlan } from "../../types";
import { IconArrowRight, IconChevronRight } from "./icons";
import { IconForkSpoon } from "./extraicons";
import MealSlotIcon from "./MealSlotIcon";
import { usePreferences } from "../../context/PreferencesContext";

interface MealPlanCardProps {
  week: DayMealPlan[];
}

export default function MealPlanCard({ week }: MealPlanCardProps) {
  const { t } = usePreferences();
  const navigate = useNavigate();
  const todayIndex = Math.max(0, week.findIndex((d) => d.isToday));
  const [activeIndex, setActiveIndex] = useState(todayIndex);
  const active = week[activeIndex];

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-xl text-ink">
          <IconForkSpoon className="h-6 w-6 text-forest" />
          {t("mealplan_your_plan")}
        </h2>
        <button
          onClick={() => navigate("/plan")}
          className="flex items-center gap-1 text-sm font-medium text-ink/80 transition-colors hover:text-forest"
        >
          {t("mealplan_this_week")}
          <IconArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {week.map((day, i) => (
          <button
            key={day.day}
            onClick={() => setActiveIndex(i)}
            className={`flex flex-shrink-0 flex-col items-center rounded-xl px-3.5 py-1.5 text-center transition-colors ${
              i === activeIndex ? "bg-forest text-offwhite" : "text-ink/80 hover:bg-forest-light"
            }`}
          >
            <span className="text-sm font-medium">{day.day}</span>
            <span className={`text-[11px] ${i === activeIndex ? "text-offwhite/70" : "text-inkMuted"}`}>
              {day.date}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {active.meals.length === 0 && (
          <p className="py-6 text-center text-sm text-inkMuted">No meals planned for this day.</p>
        )}
        {active.meals.map((meal) => {
          const subtitle =
            [meal.minutes ? `${meal.minutes} ${t("recent_recipes_min")}` : null, meal.tag]
              .filter(Boolean)
              .join(" · ") || meal.time;
          return (
            <button
              key={meal.slot}
              onClick={() => navigate("/plan")}
              className="flex w-full items-center gap-4 rounded-2xl border border-line bg-paper p-4 text-left transition-colors hover:bg-forest-light/40"
            >
              <MealSlotIcon slot={meal.slot} className="mr-1 h-14 w-14" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-inkMuted">{meal.label}</p>
                <p className="font-display text-lg leading-snug text-ink">{meal.name}</p>
                <p className="text-xs text-inkMuted">{subtitle}</p>
              </div>
              <span className="flex-shrink-0 rounded-full bg-forest-light px-3 py-1 text-xs font-medium text-forest-deep">
                {meal.kcal} {t("mealplan_kcal")}
              </span>
              <IconChevronRight className="h-4 w-4 flex-shrink-0 text-inkMuted" />
            </button>
          );
        })}
      </div>
    </div>
  );
}