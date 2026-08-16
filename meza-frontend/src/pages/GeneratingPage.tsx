import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Leaf, Soup, Heart, ShoppingCart, WandSparkles, Sparkles } from "lucide-react";
import Logo from "../components/ui/Logo";
import {
  getMealPlanDetail,
  getMealPlanStatus,
  type MealPlanDetail,
  type MealPlanStatus,
} from "../lib/mealplans";

const SIM_STEPS = [
  { label: "Understanding your goals", icon: Leaf },
  { label: "Finding the best Kenyan meals", icon: Soup },
  { label: "Balancing nutrition", icon: Heart },
  { label: "Checking ingredients", icon: ShoppingCart },
  { label: "Finalizing your meal plan", icon: WandSparkles },
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
          {/* Progress ring badge */}
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
            <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#E7EFE3" strokeWidth="3" />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#2F4B33"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={2 * Math.PI * 28 * (1 - displayPct / 100)}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-light">
              <Sparkles className="h-5 w-5 text-forest" strokeWidth={1.75} />
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-inkMuted">
            Preparing your plan
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-forest-deep sm:text-3xl">
            {plan?.status === "failed" ? "Generation failed" : "Building your plan…"}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-inkMuted">
            {plan?.status === "failed"
              ? plan.error_message || "Something went wrong — please try again."
              : "We're putting together your personalized week of Kenyan meals just for you."}
          </p>

          {plan?.status !== "failed" && (
            <div className="mt-8 rounded-2xl border border-line/60 bg-paper/80 p-5 text-left sm:p-6">
              {/* Desktop: horizontal steps with dashed connectors */}
              <div className="relative hidden sm:flex sm:items-start sm:justify-between">
                <div className="absolute left-0 right-0 top-5 border-t border-dashed border-line" />
                {SIM_STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const active = i <= activeStepIndex;
                  return (
                    <div key={s.label} className="relative flex flex-1 flex-col items-center gap-2 px-1 text-center">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ${
                          active ? "bg-forest text-offwhite" : "bg-forest-light text-inkMuted"
                        }`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <span className="text-xs text-inkMuted">{s.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Mobile: vertical step list */}
              <div className="flex flex-col gap-4 sm:hidden">
                {SIM_STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const active = i <= activeStepIndex;
                  return (
                    <div key={s.label} className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                          active ? "bg-forest text-offwhite" : "bg-forest-light text-inkMuted"
                        }`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <span className="text-sm text-ink">{s.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="relative mt-6 h-2 w-full rounded-full bg-forest-light sm:mt-8">
                <div
                  className="h-full rounded-full bg-forest transition-all duration-500 ease-out"
                  style={{ width: `${displayPct}%` }}
                />
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
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-line/50 bg-forest-light/50 px-4 py-3 text-left">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.75} />
              <p className="text-xs text-ink">
                <strong className="font-robotoCondensed font-medium">Great things take a little time</strong>
                <br />
                We're handpicking the best recipes and building a plan you'll love.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}