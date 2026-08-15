import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useAuth } from "../context/authContext";
import { getActiveMealPlan, type MealPlanDetail } from "../lib/mealplans";
import { ApiError } from "../lib/api";
import { buildDayMealPlans } from "../lib/planTransforms";

export default function MealPlannerPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<MealPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasNoPlan, setHasNoPlan] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getActiveMealPlan()
      .then((p) => {
        if (!cancelled) setPlan(p);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) setHasNoPlan(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const userName = user?.full_name?.split(" ")[0] ?? "there";

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

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 pt-6 sm:pt-8">
        <h1 className="font-display text-3xl text-ink">Your meal plan</h1>

        {week.map((day) => (
          <div key={day.day} className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-ink">
                {day.day} · {day.date}
              </h2>
              {day.isToday && (
                <span className="rounded-full bg-forest px-3 py-1 text-xs font-medium text-offwhite">
                  Today
                </span>
              )}
            </div>

            {day.meals.length === 0 ? (
              <p className="mt-4 text-sm text-inkMuted">No meals planned for this day.</p>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {day.meals.map((meal) => (
                  <div
                    key={meal.slot}
                    className="flex items-center gap-4 rounded-xl border border-line p-3"
                  >
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-forest-light text-2xl">
                      {meal.image ? (
                        <img src={meal.image} alt={meal.name} className="h-full w-full object-cover" />
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
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}