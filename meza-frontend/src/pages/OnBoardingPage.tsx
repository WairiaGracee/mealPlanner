import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/ui/Logo";
import ProgressBar from "../components/onboarding/ProgressBar";
import OptionCard from "../components/onboarding/OptionCard";
import FruitCharacter from "../components/onboarding/FruitCharacter";
import {
  GOAL_OPTIONS,
  HOUSEHOLD_OPTIONS,
  DIET_OPTIONS,
  ALLERGY_OPTIONS,
  COOKING_TIME_OPTIONS,
  BUDGET_OPTIONS,
} from "../data/OnboardingOptions";
import {
  EMPTY_ONBOARDING_DATA,
  type Allergy,
  type OnboardingData,
} from "../types";
import { submitOnboardingProfile, generateMealPlan } from "../lib/mealplans";
import { ApiError } from "../lib/api";

const TOTAL_STEPS = 7;

const STEP_CAPTIONS: { title: string; subtitle: string }[] = [
  { title: "Your journey starts here", subtitle: "We'll personalize your meal plan based on your goals and lifestyle." },
  { title: "Cooking for more than yourself?", subtitle: "We'll size portions and shopping lists to match your household." },
  { title: "Eating your way", subtitle: "Vegetarian, vegan, halal — we'll build around what works for you." },
  { title: "Keeping you safe", subtitle: "We'll steer clear of anything you're allergic to." },
  { title: "Time is precious", subtitle: "Meals that fit the time you actually have to cook." },
  { title: "Budget-friendly and delicious", subtitle: "Kenyan cooking doesn't have to break the bank." },
  { title: "Almost there!", subtitle: "A couple more details to fine-tune your plan." },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(EMPTY_ONBOARDING_DATA);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAllergy(value: Allergy) {
    setData((prev) => {
      if (value === "none") {
        return { ...prev, allergies: ["none"] };
      }
      const withoutNone = prev.allergies.filter((a) => a !== "none");
      const has = withoutNone.includes(value);
      return {
        ...prev,
        allergies: has
          ? withoutNone.filter((a) => a !== value)
          : [...withoutNone, value],
      };
    });
  }

  const canContinue = (() => {
    switch (step) {
      case 1:
        return data.goal !== null;
      case 2:
        return data.household !== null;
      case 3:
        return data.dietStyle !== null;
      case 4:
        return data.allergies.length > 0;
      case 5:
        return data.cookingTime !== null;
      case 6:
        return data.budget !== null;
      case 7:
        return true;
      default:
        return false;
    }
  })();

  function handleBack() {
    if (step === 1) {
      navigate("/register");
      return;
    }
    setStep((s) => s - 1);
  }

  async function handleContinue() {
    if (!canContinue) return;

    if (step === TOTAL_STEPS) {
      setError("");
      setSubmitting(true);
      try {
        await submitOnboardingProfile(data);
        const plan = await generateMealPlan();
        navigate(`/generating/${plan.id}`);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message || "Couldn't start building your plan."
            : "Something went wrong. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setStep((s) => s + 1);
  }

  const caption = STEP_CAPTIONS[step - 1];

  return (
    <div className="bg-offwhite bg-fruit-pattern bg-repeat lg:h-screen lg:overflow-hidden">
      <div className="lg:flex lg:h-screen">
        {/* Main content column */}
        <div className="flex flex-col lg:h-screen lg:flex-[1.3] lg:overflow-hidden">
          <header className="flex flex-shrink-0 items-center justify-between px-6 py-6 md:px-12">
            <Logo className="h-12 w-auto sm:h-14" />
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-full border border-line bg-paper px-4 py-2 font-robotoCondensed text-xs uppercase tracking-[0.15em] text-inkMuted transition-colors hover:border-forest/40 hover:bg-forest-light hover:text-ink"
            >
              Skip for now
            </button>
          </header>

          <div className="flex-shrink-0 px-6 md:px-12">
            <div className="mx-auto w-full max-w-xl">
              <ProgressBar step={step} totalSteps={TOTAL_STEPS} />
            </div>
          </div>

          <div className="scroll-on-hover mt-6 flex-1 px-6 pb-8 lg:overflow-y-auto md:px-12">
            <div className="mx-auto w-full max-w-xl">
              {step === 1 && (
                <StepShell
                  title="What's your main goal?"
                  subtitle="This shapes the meals and portions we plan for you."
                >
                  <div className="flex flex-col gap-3">
                    {GOAL_OPTIONS.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        label={opt.label}
                        description={opt.description}
                        icon={opt.icon}
                        selected={data.goal === opt.value}
                        onClick={() => update("goal", opt.value)}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 2 && (
                <StepShell
                  title="Who are you cooking for?"
                  subtitle="We'll size portions and shopping lists accordingly."
                >
                  <div className="grid grid-cols-2 gap-3">
                    {HOUSEHOLD_OPTIONS.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        label={opt.label}
                        icon={opt.icon}
                        selected={data.household === opt.value}
                        onClick={() => update("household", opt.value)}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 3 && (
                <StepShell
                  title="Any dietary style we should follow?"
                  subtitle="Pick the one that fits best — you can fine-tune later."
                >
                  <div className="flex flex-col gap-3">
                    {DIET_OPTIONS.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        label={opt.label}
                        icon={opt.icon}
                        selected={data.dietStyle === opt.value}
                        onClick={() => update("dietStyle", opt.value)}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 4 && (
                <StepShell
                  title="Any allergies or ingredients to avoid?"
                  subtitle="Select all that apply — we'll keep these out of your plan."
                >
                  <div className="grid grid-cols-2 gap-3">
                    {ALLERGY_OPTIONS.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        label={opt.label}
                        icon={opt.icon}
                        selected={data.allergies.includes(opt.value)}
                        onClick={() => toggleAllergy(opt.value)}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 5 && (
                <StepShell
                  title="How much time can you give to cooking?"
                  subtitle="Per meal, on a typical day."
                >
                  <div className="flex flex-col gap-3">
                    {COOKING_TIME_OPTIONS.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        label={opt.label}
                        description={opt.description}
                        icon={opt.icon}
                        selected={data.cookingTime === opt.value}
                        onClick={() => update("cookingTime", opt.value)}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 6 && (
                <StepShell
                  title="What's your grocery budget like?"
                  subtitle="We'll match recipes and shopping lists to fit."
                >
                  <div className="flex flex-col gap-3">
                    {BUDGET_OPTIONS.map((opt) => (
                      <OptionCard
                        key={opt.value}
                        label={opt.label}
                        description={opt.description}
                        icon={opt.icon}
                        selected={data.budget === opt.value}
                        onClick={() => update("budget", opt.value)}
                      />
                    ))}
                  </div>
                </StepShell>
              )}

              {step === 7 && (
                <StepShell
                  title="A couple more details"
                  subtitle="Optional — helps us fine-tune portions and calories."
                >
                  <div className="flex flex-col gap-5">
                    <MeasurementField
                      label="Weight"
                      value={data.weight}
                      onValueChange={(v) => update("weight", v)}
                      unit={data.weightUnit}
                      onUnitChange={(u) => update("weightUnit", u as OnboardingData["weightUnit"])}
                      units={["kg", "lb"]}
                    />
                    <MeasurementField
                      label="Height"
                      value={data.height}
                      onValueChange={(v) => update("height", v)}
                      unit={data.heightUnit}
                      onUnitChange={(u) => update("heightUnit", u as OnboardingData["heightUnit"])}
                      units={["cm", "ft"]}
                    />
                  </div>
                </StepShell>
              )}

              {error && <p className="mt-6 text-sm text-clay">{error}</p>}
            </div>
          </div>

          <div className="flex-shrink-0 px-6 py-6 md:px-12">
            <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-4">
              <button
                onClick={handleBack}
                className="font-robotoCondensed text-xs uppercase tracking-[0.15em] text-inkMuted transition-colors hover:text-ink"
              >
                ← Back
              </button>
              <button
                onClick={handleContinue}
                disabled={!canContinue || submitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-8 py-3 font-robotoCondensed text-sm font-medium tracking-wide text-offwhite transition-colors duration-200 hover:bg-forest-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-inkMuted"
              >
                {submitting
                  ? "Starting…"
                  : step === TOTAL_STEPS
                    ? "Build my plan"
                    : "Continue →"}
              </button>
            </div>
          </div>

          {/* Mobile-only fruit panel — flows naturally below the buttons */}
          <div className="flex flex-col items-center gap-4 px-6 pb-16 pt-4 text-center lg:hidden">
            <FruitCharacter step={step} className="h-56 w-56" />
            <div>
              <h2 className="font-robotoCondensed text-xl font-medium text-ink">{caption.title}</h2>
              <p className="mt-1 max-w-xs text-sm text-inkMuted">{caption.subtitle}</p>
            </div>
            <StepDots step={step} totalSteps={TOTAL_STEPS} />
          </div>
        </div>

        {/* Desktop-only fruit panel — fixed, never scrolls */}
        <div className="hidden lg:flex lg:h-screen lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:gap-6 lg:bg-forest-light/30 lg:px-10">
          <FruitCharacter step={step} className="h-80 w-80" />
          <div className="text-center">
            <h2 className="font-robotoCondensed text-2xl font-medium text-ink">{caption.title}</h2>
            <p className="mt-2 max-w-xs text-sm text-inkMuted">{caption.subtitle}</p>
          </div>
          <StepDots step={step} totalSteps={TOTAL_STEPS} />
        </div>
      </div>
    </div>
  );
}

function StepDots({ step, totalSteps }: { step: number; totalSteps: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === step - 1 ? "w-5 bg-forest" : "w-1.5 bg-forest/25"
          }`}
        />
      ))}
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="font-robotoCondensed text-3xl font-medium text-ink md:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-inkMuted">{subtitle}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function MeasurementField({
  label,
  value,
  onValueChange,
  unit,
  onUnitChange,
  units,
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  unit: string;
  onUnitChange: (u: string) => void;
  units: [string, string];
}) {
  return (
    <div>
      <label className="font-robotoCondensed text-xs uppercase tracking-[0.15em] text-inkMuted">
        {label}
      </label>
      <div className="mt-2 flex overflow-hidden rounded-xl border border-line bg-paper">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Optional"
          className="w-full bg-transparent px-4 py-3 text-sm text-ink placeholder:text-inkMuted/60 focus-visible:outline-none"
        />
        <div className="flex flex-shrink-0 items-center gap-1 border-l border-line px-2">
          {units.map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => onUnitChange(u)}
              className={`rounded-full px-3 py-1.5 font-robotoCondensed text-xs font-medium transition-colors ${
                unit === u
                  ? "bg-forest text-offwhite"
                  : "text-inkMuted hover:text-ink"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}