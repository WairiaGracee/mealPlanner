import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatsRow from "../components/dashboard/StatsRow";
import MealPlanCard from "../components/dashboard/MealPlanCard";
import NutritionOverviewCard from "../components/dashboard/NutritionOverviewCard";
import HydrationCard from "../components/dashboard/HydrationCard";
import UpcomingMealsCard from "../components/dashboard/UpcomingMealsCard";
import NutritionSummaryCard from "../components/dashboard/NutritionSummaryCard";
import DailyTipCard from "../components/dashboard/DailyTipCard";
import RecentRecipesGrid from "../components/dashboard/RecentRecipesGrid";
import BottomBanner from "../components/dashboard/BottomBanner";
import {
  STAT_CARDS,
  DAY_MEAL_PLANS,
  NUTRITION_OVERVIEW,
  HYDRATION_GOAL,
  UPCOMING_MEALS,
  POPULAR_RECIPES,
} from "../data/dashboardData";

// TODO: replace with the signed-in user's real name and goal once the
// Django backend and onboarding submission are wired up.
const USER_NAME = "Grace";

export default function DashboardPage() {
  return (
    <DashboardLayout userName={USER_NAME}>
      <div className="mx-auto flex max-w-7xl flex-col gap-5 pt-6 sm:pt-8">

        <StatsRow stats={STAT_CARDS} />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr_1fr]">
          <MealPlanCard week={DAY_MEAL_PLANS} />

          <div className="flex flex-col gap-5">
            <NutritionOverviewCard overview={NUTRITION_OVERVIEW} />
            <HydrationCard hydration={HYDRATION_GOAL} />
          </div>

          <div className="flex flex-col gap-5">
            <UpcomingMealsCard meals={UPCOMING_MEALS} />
            <NutritionSummaryCard overview={NUTRITION_OVERVIEW} />
            <DailyTipCard tip="Plan your meals ahead to save time and make healthier choices." />
          </div>
        </div>

        <RecentRecipesGrid recipes={POPULAR_RECIPES} />

        <BottomBanner />
      </div>
    </DashboardLayout>
  );
}