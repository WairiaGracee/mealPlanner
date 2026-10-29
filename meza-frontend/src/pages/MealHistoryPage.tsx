import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { IconChevronDown, IconHistory, IconHome } from "../components/dashboard/icons";
import { useAuth } from "../context/authContext";
import {
  getMealPlanDetail,
  getMealPlanHistory,
  type MealPlanDetail,
  type MealPlanSummary,
} from "../lib/mealplans";

const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_ORDER: Record<string, number> = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };

function formatWeek(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export default function MealHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<MealPlanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, MealPlanDetail>>({});

  const userName = user?.full_name?.split(" ")[0] ?? "there";

  useEffect(() => {
    let cancelled = false;
    getMealPlanHistory()
      .then((p) => {
        if (!cancelled) setPlans(p);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load your meal history. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggle(id: string) {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    if (details[id]) return;
    setLoadingId(id);
    setError(null);
    try {
      const d = await getMealPlanDetail(id);
      setDetails((prev) => ({ ...prev, [id]: d }));
    } catch {
      setError("Couldn't load that plan. Please try again.");
      setOpenId(null);
    } finally {
      setLoadingId(null);
    }
  }

  if (loading) {
    return (
      <DashboardLayout userName={userName}>
        <div className="flex h-64 items-center justify-center text-sm text-inkMuted">
          Loading meal history…
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-3xl flex-col gap-5 pt-0">
        <div>
          <nav className="flex items-center gap-2 text-xs text-inkMuted">
            <IconHome className="h-3.5 w-3.5" />
            <button onClick={() => navigate("/dashboard")} className="hover:text-forest">
              Kitchen
            </button>
            <span>/</span>
            <span className="text-ink">Meal History</span>
          </nav>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Meal history</h1>
          <p className="mt-1 text-sm text-inkMuted">Every weekly plan you've generated.</p>
        </div>

        {error && (
          <p className="rounded-xl border border-line bg-paper px-4 py-3 text-sm text-clay">
            {error}
          </p>
        )}

        {plans.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 pt-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-light text-forest">
              <IconHistory className="h-6 w-6" />
            </span>
            <h2 className="font-display text-xl text-ink">No past plans yet</h2>
            <p className="text-sm text-inkMuted">
              Your weekly meal plans will show up here once they're ready.
            </p>
            <button
              onClick={() => navigate("/plan")}
              className="mt-2 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
            >
              Go to meal planner
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {plans.map((plan) => {
              const open = openId === plan.id;
              const detail = details[plan.id];
              return (
                <div key={plan.id} className="rounded-2xl border border-line bg-paper">
                  <button
                    onClick={() => toggle(plan.id)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
                  >
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 font-medium text-ink">
                        Week of {formatWeek(plan.week_start_date)}
                        {plan.is_active && (
                          <span className="rounded-full bg-forest px-2.5 py-0.5 text-[11px] font-medium text-offwhite">
                            Current
                          </span>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-inkMuted">{plan.meal_count} meals</p>
                      <div className="mt-3 flex items-center gap-2">
                        {plan.preview.map((p, i) => (
                          <span
                            key={i}
                            title={p.name}
                            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-forest-light text-lg"
                          >
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                            ) : (
                              p.emoji || "🍽️"
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                    <IconChevronDown
                      className={`h-4 w-4 flex-shrink-0 text-inkMuted transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {open && (
                    <div className="border-t border-line p-4 sm:p-5">
                      {loadingId === plan.id || !detail ? (
                        <p className="text-sm text-inkMuted">Loading meals…</p>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {DAY_LABELS.map((label, day) => {
                            const meals = detail.meals
                              .filter((m) => m.day_of_week === day)
                              .sort(
                                (a, b) =>
                                  (MEAL_ORDER[a.meal_type] ?? 9) - (MEAL_ORDER[b.meal_type] ?? 9)
                              );
                            if (meals.length === 0) return null;
                            return (
                              <div key={label}>
                                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-forest">
                                  {label}
                                </p>
                                <div className="mt-1.5 flex flex-col">
                                  {meals.map((m) => (
                                    <button
                                      key={m.id}
                                      onClick={() => navigate(`/recipes/${m.recipe.id}`)}
                                      className="flex items-baseline justify-between gap-3 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-forest-light/40"
                                    >
                                      <span className="text-ink">
                                        <span className="mr-2 text-xs capitalize text-inkMuted">
                                          {m.meal_type}
                                        </span>
                                        {m.recipe.name}
                                      </span>
                                      {m.recipe.calories != null && (
                                        <span className="flex-shrink-0 text-xs text-inkMuted">
                                          {m.recipe.calories} kcal
                                        </span>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}