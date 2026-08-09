import type { TodayMeal } from "../../types";

interface MealsCardProps {
  meals: TodayMeal[];
}

const SLOT_LABEL: Record<TodayMeal["slot"], string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

const SLOT_GLYPH: Record<TodayMeal["slot"], string> = {
  breakfast: "☀️",
  lunch: "☀️",
  dinner: "🌙",
};

export default function MealsCard({ meals }: MealsCardProps) {
  const totalKcal = meals.reduce((sum, m) => sum + m.kcal, 0);

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Today's meals</h2>
        <span className="text-sm text-inkMuted">Total: ~{totalKcal.toLocaleString()} kcal</span>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {meals.map((meal) => (
          <div
            key={meal.slot}
            className="flex flex-col gap-4 rounded-xl border border-line p-4 sm:flex-row sm:items-center"
          >
            <div className="flex flex-shrink-0 flex-col items-center gap-1 sm:w-20">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-light text-base">
                {SLOT_GLYPH[meal.slot]}
              </span>
              <span className="text-xs font-medium text-ink">{SLOT_LABEL[meal.slot]}</span>
              <span className="text-[11px] text-inkMuted">{meal.time}</span>
            </div>

            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-forest-light text-3xl">
              {meal.emoji}
            </div>

            <div className="flex-1">
              <p className="font-medium text-ink">{meal.name}</p>
              <p className="mt-1 text-sm text-inkMuted">
                {meal.kcal} kcal · {meal.minutes} min
              </p>
            </div>

            <div className="flex flex-shrink-0 items-center gap-3 sm:flex-col sm:items-end">
              <button className="rounded-full bg-forest px-4 py-2 text-xs font-medium text-offwhite transition-colors hover:bg-forest-deep">
                View recipe
              </button>
              <button className="text-xs font-medium text-inkMuted transition-colors hover:text-ink">
                ⇄ Swap meal
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-5 flex items-center gap-1 text-sm font-medium text-forest hover:text-forest-deep">
        View full day plan →
      </button>
    </div>
  );
}