import type { UpcomingMeal } from "../../types";
import { IconChevronRight } from "./icons";

interface UpcomingMealsCardProps {
  meals: UpcomingMeal[];
}

export default function UpcomingMealsCard({ meals }: UpcomingMealsCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-ink">Upcoming meals</h2>
        <button className="text-xs font-medium text-forest hover:text-forest-deep">
          View all
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {meals.map((meal) => (
          <div
            key={`${meal.day}-${meal.slot}`}
            className="flex items-center gap-3 rounded-xl border border-line p-2.5 transition-colors hover:bg-forest-light/40"
          >
            <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-forest-light text-xl">
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