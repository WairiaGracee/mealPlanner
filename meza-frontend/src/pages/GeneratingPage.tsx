import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../components/ui/Logo";
import CookingScene from "../components/onboarding/CookingScene";
import {
  getMealPlanDetail,
  getMealPlanStatus,
  type MealPlanDetail,
  type MealPlanStatus,
} from "../lib/mealplans";

const SIM_STEPS = [
  { label: "Understanding your goals", emoji: "🌿" },
  { label: "Finding the best Kenyan meals", emoji: "🍲" },
  { label: "Balancing nutrition", emoji: "💚" },
  { label: "Checking ingredients", emoji: "🛒" },
  { label: "Finalizing your meal plan", emoji: "✨" },
];
// Simulated progress only — the real backend has no granular milestones,
// so this climbs on a timer and caps below 100% until the actual
// generation request comes back "ready".
const SIM_CAP_PCT = 92;
const SIM_INTERVAL_MS = 700;
const SIM_STEP_PCT = 2.4;

export default function GeneratingPage() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<MealPlanStatus | null>(null);
  const [detail, setDetail] = useState<MealPlanDetail | null>(null);
  const [connectionError, setConnectionError] = useState("");
  const [simPct, setSimPct] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval>>();
  const simRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!planId) return;

    async function poll() {
      try {
        const current = await getMealPlanStatus(planId!);
        setPlan(current);
        if (current.status === "ready") {
          clearInterval(pollRef.current);
          clearInterval(simRef.current);
          setSimPct(100);
          const full = await getMealPlanDetail(planId!);
          setDetail(full);
        } else if (current.status === "failed") {
          clearInterval(pollRef.current);
          clearInterval(simRef.current);
        }
      } catch {
        clearInterval(pollRef.current);
        clearInterval(simRef.current);
        setConnectionError("Lost connection while building your plan.");
      }
    }

    poll();
    pollRef.current = setInterval(poll, 2500);
    simRef.current = setInterval(() => {
      setSimPct((p) => Math.min(p + SIM_STEP_PCT, SIM_CAP_PCT));
    }, SIM_INTERVAL_MS);

    return () => {
      clearInterval(pollRef.current);
      clearInterval(simRef.current);
    };
  }, [planId]);

  const isDone = plan?.status === "ready" || plan?.status === "failed";
  const displayPct = plan?.status === "ready" ? 100 : Math.round(simPct);
  const activeStepIndex = Math.min(
    SIM_STEPS.length - 1,
    Math.floor((displayPct / 100) * SIM_STEPS.length)
  );
  const recipeCount = detail ? new Set(detail.meals.map((m) => m.recipe.id)).size : 0;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-offwhite bg-fruit-pattern bg-repeat px-6 py-16 text-center">
      <Logo className="mb-8 h-12 w-auto" />

      {connectionError ? (
        <p className="max-w-sm text-sm text-clay">{connectionError}</p>
      ) : (
        <div className="w-full max-w-2xl rounded-3xl border border-line/60 bg-paper/70 p-6 shadow-sm backdrop-blur-sm sm:p-10">
          <CookingScene className="mx-auto h-48 w-64 sm:h-56 sm:w-80" />

          <h1 className="mt-4 font-robotoCondensed text-2xl font-medium text-ink sm:text-3xl">
            {plan?.status === "failed" ? "Generation failed" : "Building your plan…"}
          </h1>
          <p className="mt-2 text-sm text-inkMuted">
            {plan?.status === "failed"
              ? plan.error_message || "Something went wrong — please try again."
              : "We're crafting a delicious week of Kenyan meals tailored just for you."}
          </p>

          {plan?.status !== "failed" && (
            <div className="mt-8 rounded-2xl border border-line/60 bg-paper/80 p-5 text-left sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 sm:flex-nowrap">
                {SIM_STEPS.map((s, i) => (
                  <div key={s.label} className="flex flex-1 flex-col items-center gap-2 text-center">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-base transition-colors duration-300 ${
                        i <= activeStepIndex
                          ? "bg-forest text-offwhite"
                          : "bg-forest-light text-inkMuted"
                      }`}
                    >
                      {s.emoji}
                    </span>
                    <span className="text-xs text-inkMuted">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="relative mt-8 h-2 w-full rounded-full bg-forest-light">
                <div
                  className="h-full rounded-full bg-forest transition-all duration-500 ease-out"
                  style={{ width: `${displayPct}%` }}
                />
                <span
                  className="absolute -top-2.5 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-paper text-sm shadow transition-all duration-500 ease-out"
                  style={{ left: `${displayPct}%` }}
                >
                  🍊
                </span>
              </div>
              <p className="mt-4 text-center text-xs text-inkMuted">{displayPct}% complete</p>
            </div>
          )}

          {isDone && (
            <>
              {detail && (
                <div className="mt-6 flex justify-center gap-8 text-sm text-ink">
                  <div>
                    <span className="font-robotoCondensed text-2xl font-medium">{detail.meals.length}</span>
                    <p className="text-inkMuted">meals planned</p>
                  </div>
                  <div>
                    <span className="font-robotoCondensed text-2xl font-medium">{recipeCount}</span>
                    <p className="text-inkMuted">distinct recipes</p>
                  </div>
                  <div>
                    <span className="font-robotoCondensed text-2xl font-medium">{detail.grocery_items.length}</span>
                    <p className="text-inkMuted">grocery items</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate("/dashboard")}
                className="mt-8 rounded-full bg-forest px-8 py-3 font-robotoCondensed text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
              >
                Continue to dashboard
              </button>
            </>
          )}

          {!isDone && (
            <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-line/50 bg-forest-light/50 px-4 py-3 text-left text-xs text-ink">
              <span>✨</span>
              <span>
                <strong className="font-robotoCondensed font-medium">Great things take a little time.</strong>{" "}
                We're handpicking the best recipes and building a plan you'll love.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}