import { forwardRef } from "react";
import Logo from "../ui/Logo";
import type { DayMealPlan } from "../../types";

interface MealPlanExportCardProps {
  week: DayMealPlan[];
  weekRange: string;
  userName: string;
}

// Rendered off-screen (fixed, way outside the viewport) purely so
// ExportMenu can rasterize it with html-to-image — this is a
// purpose-built flyer layout, never shown to the user directly, so it
// stays clean and print-worthy regardless of what the live dashboard
// page currently looks like.
const MealPlanExportCard = forwardRef<HTMLDivElement, MealPlanExportCardProps>(
  function MealPlanExportCard({ week, weekRange, userName }, ref) {
    return (
      <div className="fixed left-0 top-0 h-0 w-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
      <div ref={ref} className="w-[720px] bg-offwhite">
        <div className="flex flex-col gap-6 p-10">
          <div className="flex items-center justify-between border-b border-line pb-6">
            <Logo className="h-10 w-auto" />
            <div className="text-right">
              <p className="font-display text-2xl text-ink">Weekly Meal Plan</p>
              <p className="text-sm text-inkMuted">{weekRange}</p>
            </div>
          </div>

          <p className="text-sm text-inkMuted">Prepared for {userName}</p>

          <div className="flex flex-col gap-4">
            {week.map((day) => (
              <div key={day.day} className="rounded-2xl border border-line bg-paper p-5">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-robotoCondensed text-sm font-semibold uppercase tracking-[0.1em] text-forest">
                    {day.day} · {day.date}
                  </h3>
                  {day.isToday && (
                    <span className="rounded-full bg-forest px-2.5 py-0.5 text-[10px] font-medium text-offwhite">
                      Today
                    </span>
                  )}
                </div>

                {day.meals.length === 0 ? (
                  <p className="mt-2 text-sm text-inkMuted">No meals planned.</p>
                ) : (
                  <div className="mt-3 flex flex-col gap-2">
                    {day.meals.map((meal, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-forest-light text-lg">
                          {meal.emoji}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-ink">{meal.name}</p>
                          <p className="text-xs text-inkMuted">
                            {meal.label} · {meal.time}
                          </p>
                        </div>
                        <p className="text-xs font-medium text-inkMuted">{meal.kcal} kcal</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-forest-light/50 px-5 py-3 text-center text-xs text-inkMuted">
            Made with Meza — Kenyan meal planning, personalized to you.
          </div>
        </div>
      </div>
      </div>
    );
  }
);

export default MealPlanExportCard;