import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardGreeting from "../components/dashboard/DashboardGreeting";
import NutritionHeroCard from "../components/dashboard/NutritionHeroCard";
import FruitMascot from "../components/dashboard/FruitMascot";
import QuickActionsCard from "../components/dashboard/QuickActionsCard";
import WriteRecipeCard from "../components/dashboard/WriteRecipeCard";
import MealPlanCard from "../components/dashboard/MealPlanCard";
import GoalsCard from "../components/dashboard/GoalsCard";
import ShoppingListStrip from "../components/dashboard/ShoppingListStrip";
import QuoteCard from "../components/dashboard/QuoteCard";
import Flourish from "../components/dashboard/Flourish";
import { useAuth } from "../context/authContext";
import { usePreferences } from "../context/PreferencesContext";
import { getActiveMealPlan, type MealPlanDetail } from "../lib/mealplans";
import { ApiError } from "../lib/api";
import { buildDayMealPlans, getTodayDayOfWeek, macrosForDay } from "../lib/planTransforms";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = usePreferences();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<MealPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasNoPlan, setHasNoPlan] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const activePlan = await getActiveMealPlan();
        if (cancelled) return;
        setPlan(activePlan);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setHasNoPlan(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const userName = user?.full_name?.split(" ")[0] ?? "there";

  if (loading) {
    return (
      <DashboardLayout userName={userName}>
        <div className="flex h-64 items-center justify-center text-sm text-inkMuted">
          {t("dashboard_loading")}
        </div>
      </DashboardLayout>
    );
  }

  if (hasNoPlan || !plan) {
    return (
      <DashboardLayout userName={userName}>
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-24 text-center">
          <h1 className="font-display text-2xl text-ink">{t("dashboard_no_plan_title")}</h1>
          <p className="text-sm text-inkMuted">{t("dashboard_no_plan_body")}</p>
          <button
            onClick={() => navigate("/onboarding")}
            className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
          >
            {t("dashboard_start_onboarding")}
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const dayMealPlans = buildDayMealPlans(plan);
  const todayIdx = getTodayDayOfWeek(plan);
  const today =
    todayIdx === null
      ? { kcal: 0, protein: 0, carbs: 0, fat: 0 }
      : macrosForDay(plan, todayIdx);
  const target = plan.weekly_nutrition?.calorie_goal || 2000;

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-7xl flex-col gap-5 pt-0">
        <DashboardGreeting userName={userName} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_auto_1fr]">
          <NutritionHeroCard
            kcal={today.kcal}
            target={target}
            protein={today.protein}
            carbs={today.carbs}
            fat={today.fat}
          />
          <FruitMascot />
          <div className="flex flex-col gap-5">
            <QuickActionsCard />
            <WriteRecipeCard />
          </div>

          <div className="xl:col-span-2">
            <MealPlanCard week={dayMealPlans} />
          </div>
          <GoalsCard />

          <div className="xl:col-span-2">
            <ShoppingListStrip count={plan.grocery_items.length} />
          </div>
          <QuoteCard />

          <div className="xl:col-span-3">
            <Flourish name={userName} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}