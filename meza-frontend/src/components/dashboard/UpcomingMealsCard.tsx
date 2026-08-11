import type { UpcomingMeal } from "../../types";

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
          <div key={`${meal.day}-${meal.slot}`} className="flex items-center gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-forest-light text-xl">
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
              <p className="text-sm font-medium text-ink">{meal.name}</p>
              <p className="text-xs text-inkMuted">
                {meal.day} · {meal.slot}
              </p>
            </div>
            <button
              aria-label="Save meal"
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-inkMuted transition-colors hover:bg-forest-light hover:text-forest"
            >
              🔖
            </button>
          </div>
        ))}
      </div>

      <button className="mt-5 w-full rounded-full bg-forest py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep">
        Go to meal planner
      </button>
    </div>
  );
}