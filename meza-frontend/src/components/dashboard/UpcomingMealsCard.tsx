import type { UpcomingMeal } from "../../types";
import { IconChevronRight } from "./icons";
import MealSlotIcon from "./MealSlotIcon";
import { usePreferences } from "../../context/PreferencesContext";

interface UpcomingMealsCardProps {
  meals: UpcomingMeal[];
}

export default function UpcomingMealsCard({ meals }: UpcomingMealsCardProps) {
  const { t } = usePreferences();
  return (
    <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-ink">{t("upcoming_meals_title")}</h2>
        <button className="text-xs font-medium text-forest hover:text-forest-deep">
          {t("upcoming_meals_view_all")}
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {meals.map((meal) => (
          <div
            key={`${meal.day}-${meal.slot}`}
            className="flex items-center gap-3 rounded-xl border border-line p-2.5 transition-colors hover:bg-forest-light/40"
          >
            <MealSlotIcon slot={meal.slot} className="h-11 w-11" />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{meal.name}</p>
              <p className="text-xs text-inkMuted">
                {meal.day} · {meal.slot}
              </p>
            </div>
            <IconChevronRight className="h-4 w-4 flex-shrink-0 text-inkMuted" />
          </div>
        ))}
      </div>
    </div>
  );
}