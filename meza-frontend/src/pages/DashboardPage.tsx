import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatsRow from "../components/dashboard/StatsRow";
import MealPlanCard from "../components/dashboard/MealPlanCard";
import UpcomingMealsCard from "../components/dashboard/UpcomingMealsCard";
import DailyTipCard from "../components/dashboard/DailyTipCard";
import RecentRecipesGrid from "../components/dashboard/RecentRecipesGrid";
import BottomBanner from "../components/dashboard/BottomBanner";
import { useAuth } from "../context/authContext";
import { getActiveMealPlan, getRecipes, type MealPlanDetail } from "../lib/mealplans";
import { ApiError } from "../lib/api";
import {
  buildDayMealPlans,
  buildRecipeSummaries,
  buildUpcomingMeals,
  todaysCalories,
} from "../lib/planTransforms";
import type { RecipeSummary, StatCard } from "../types";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<MealPlanDetail | null>(null);
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNoPlan, setHasNoPlan] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [activePlan, recipeList] = await Promise.all([
          getActiveMealPlan(),
          getRecipes(),
        ]);
        if (cancelled) return;
        setPlan(activePlan);
        setRecipes(buildRecipeSummaries(recipeList));
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
          Loading your dashboard…
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

  const dayMealPlans = buildDayMealPlans(plan);
  const upcomingMeals = buildUpcomingMeals(plan);
  const distinctRecipeCount = new Set(plan.meals.map((m) => m.recipe.id)).size;

  const statCards: StatCard[] = [
    {
      label: "Calories Today",
      value: todaysCalories(plan).toLocaleString(),
      sub: "kcal from your plan",
      icon: "🔥",
    },
    { label: "Meals Planned", value: String(plan.meals.length), sub: "this week", icon: "📅" },
    {
      label: "Shopping Items",
      value: String(plan.grocery_items.length),
      sub: "in your list",
      icon: "🛒",
    },
    { label: "Recipes", value: String(distinctRecipeCount), sub: "generated for you", icon: "📖" },
  ];

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-7xl flex-col gap-5 pt-6 sm:pt-8">
        <StatsRow stats={statCards} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
          <MealPlanCard week={dayMealPlans} />

          <div className="flex flex-col gap-5">
            <UpcomingMealsCard meals={upcomingMeals} />
            <DailyTipCard tip="Detailed nutrition and hydration tracking is coming soon — for now, this is your real generated plan." />
          </div>
        </div>

        <RecentRecipesGrid recipes={recipes} />

        <BottomBanner />
      </div>
    </DashboardLayout>
  );
}