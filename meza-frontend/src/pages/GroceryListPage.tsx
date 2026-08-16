import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { IconBasket, IconCheck, IconLeaf } from "../components/dashboard/icons";
import { useAuth } from "../context/authContext";
import {
  getActiveMealPlan,
  toggleGroceryItem,
  type GroceryListItem,
  type MealPlanDetail,
} from "../lib/mealplans";
import { ApiError } from "../lib/api";

const CATEGORY_LABELS: Record<string, string> = {
  proteins: "Proteins",
  vegetables: "Vegetables",
  carbs_staples: "Carbohydrates & Staples",
  fruits: "Fruits",
  dairy: "Dairy",
  other: "Other",
};

export default function GroceryListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<MealPlanDetail | null>(null);
  const [items, setItems] = useState<GroceryListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNoPlan, setHasNoPlan] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getActiveMealPlan()
      .then((p) => {
        if (cancelled) return;
        setPlan(p);
        setItems(p.grocery_items);
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

  async function handleToggle(item: GroceryListItem) {
    const next = !item.is_checked;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_checked: next } : i)));
    try {
      await toggleGroceryItem(item.id, next);
    } catch {
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_checked: item.is_checked } : i))
      );
    }
  }

  const userName = user?.full_name?.split(" ")[0] ?? "there";

  if (loading) {
    return (
      <DashboardLayout userName={userName}>
        <div className="flex h-64 items-center justify-center text-sm text-inkMuted">
          Loading your grocery list…
        </div>
      </DashboardLayout>
    );
  }

  if (hasNoPlan || !plan) {
    return (
      <DashboardLayout userName={userName}>
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-24 text-center">
          <h1 className="font-display text-2xl text-ink">No grocery list yet</h1>
          <p className="text-sm text-inkMuted">
            Finish onboarding to get a shopping list built from your meal plan.
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

  const grouped = items.reduce<Record<string, GroceryListItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  const checkedCount = items.filter((i) => i.is_checked).length;
  const pct = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6 pt-6 sm:pt-8">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-display text-3xl text-ink">Grocery list</h1>
            <p className="mt-1 text-sm text-inkMuted">
              Everything you need for this week's meals, organized by aisle.
            </p>
            <div className="mt-2 h-[3px] w-14 rounded-full bg-clay" />
          </div>

          <div className="flex flex-wrap items-stretch gap-3">
            <div className="flex items-center divide-x divide-line rounded-2xl border border-line bg-paper px-5 py-3">
              <div className="pr-5 text-center">
                <p className="font-display text-xl text-ink">
                  {checkedCount}/{items.length}
                </p>
                <p className="text-[11px] text-inkMuted">Items checked</p>
              </div>
              <div className="pl-5 text-center">
                <p className="font-display text-xl text-ink">{pct}%</p>
                <p className="flex items-center justify-center gap-1 text-[11px] text-inkMuted">
                  <IconLeaf className="h-3 w-3 text-forest" />
                  Complete
                </p>
              </div>
            </div>

            <div className="flex max-w-xs items-center gap-3 rounded-2xl border border-line bg-forest-light/50 px-4 py-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                <IconBasket className="h-5 w-5" />
              </span>
              <p className="text-xs text-ink">
                <strong className="font-robotoCondensed font-medium">
                  Tap to check off.
                </strong>
                <br />
                Your progress is saved as you shop.
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-forest-light">
          <div
            className="h-full rounded-full bg-forest transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-3">
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <div key={category} className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
              <h2 className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-inkMuted">
                {CATEGORY_LABELS[category] ?? category}
              </h2>
              <div className="mt-3 flex flex-col gap-1">
                {categoryItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-forest-light"
                  >
                    <span className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={item.is_checked}
                        onChange={() => handleToggle(item)}
                        className="peer h-5 w-5 flex-shrink-0 cursor-pointer appearance-none rounded-md border border-line bg-paper transition-colors checked:border-forest checked:bg-forest"
                      />
                      <IconCheck className="pointer-events-none absolute h-3 w-3 text-offwhite opacity-0 peer-checked:opacity-100" />
                    </span>
                    <span
                      className={`text-sm ${
                        item.is_checked ? "text-inkMuted line-through" : "text-ink"
                      }`}
                    >
                      {item.name}
                      {item.quantity ? ` — ${item.quantity}` : ""}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}