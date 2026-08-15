import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../components/ui/Logo";
import {
  getMealPlanDetail,
  getMealPlanStatus,
  type MealPlanDetail,
  type MealPlanStatus,
} from "../lib/mealplans";

export default function GeneratingPage() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<MealPlanStatus | null>(null);
  const [detail, setDetail] = useState<MealPlanDetail | null>(null);
  const [connectionError, setConnectionError] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!planId) return;

    async function poll() {
      try {
        const current = await getMealPlanStatus(planId!);
        setPlan(current);
        if (current.status === "ready") {
          clearInterval(intervalRef.current);
          const full = await getMealPlanDetail(planId!);
          setDetail(full);
        } else if (current.status === "failed") {
          clearInterval(intervalRef.current);
        }
      } catch {
        clearInterval(intervalRef.current);
        setConnectionError("Lost connection while building your plan.");
      }
    }

    poll();
    intervalRef.current = setInterval(poll, 2500);
    return () => clearInterval(intervalRef.current);
  }, [planId]);

  const isDone = plan?.status === "ready" || plan?.status === "failed";
  const recipeCount = detail ? new Set(detail.meals.map((m) => m.recipe.id)).size : 0;

  return (
    <div className="flex min-h-screen flex-col items-center bg-offwhite px-6 py-16 text-center">
      <Logo className="mb-10 h-12 w-auto" />

      {connectionError ? (
        <p className="max-w-sm text-sm text-clay">{connectionError}</p>
      ) : !isDone ? (
        <>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-forest border-t-transparent" />
          <h1 className="mt-6 font-display text-2xl text-ink">Building your plan…</h1>
          <p className="mt-2 max-w-sm text-sm text-inkMuted">
            We're putting together a week of Kenyan meals tailored to what you told us.
          </p>
        </>
      ) : (
        <>
          <h1 className="font-display text-2xl text-ink">
            {plan?.status === "ready" ? "Plan generated ✅" : "Generation failed ❌"}
          </h1>
          {plan?.status === "failed" && (
            <p className="mt-2 max-w-lg text-sm text-clay">{plan.error_message}</p>
          )}

          {detail && (
            <div className="mt-6 flex gap-8 text-sm text-ink">
              <div>
                <span className="font-display text-2xl">{detail.meals.length}</span>
                <p className="text-inkMuted">meals planned</p>
              </div>
              <div>
                <span className="font-display text-2xl">{recipeCount}</span>
                <p className="text-inkMuted">distinct recipes</p>
              </div>
              <div>
                <span className="font-display text-2xl">{detail.grocery_items.length}</span>
                <p className="text-inkMuted">grocery items</p>
              </div>
            </div>
          )}

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-8 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
          >
            Continue to dashboard
          </button>
        </>
      )}

      {plan?.prompt && (
        <div className="mt-10 w-full max-w-2xl text-left">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-inkMuted">
            Prompt sent to Gemini
          </h2>
          <pre className="mt-3 max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-xl border border-line bg-paper p-4 text-xs text-ink">
            {plan.prompt}
          </pre>
        </div>
      )}

      {detail && (
        <div className="mt-10 w-full max-w-2xl text-left">
          <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-inkMuted">
            Grocery list ({detail.grocery_items.length} items)
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 rounded-xl border border-line bg-paper p-4 text-sm text-ink sm:grid-cols-3">
            {detail.grocery_items.map((item) => (
              <li key={item.id} className="truncate">
                {item.name}
                {item.quantity ? ` — ${item.quantity}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}