import DashboardLayout from "../components/dashboard/DashboardLayout";
import MealsCard from "../components/dashboard/MealsCard";
import WeekGlanceCard from "../components/dashboard/WeekGlanceCard";
import ShoppingListCard from "../components/dashboard/ShoppingListCard";
import ProgressCard from "../components/dashboard/ProgressCard";
import ChecklistCard from "../components/dashboard/ChecklistCard";
import RecipeRow from "../components/dashboard/RecipeRow";
import BottomBanner from "../components/dashboard/BottomBanner";
import { IconLeaf } from "../components/dashboard/icons";
import {
  TODAY_MEALS,
  WEEK_PLAN,
  SHOPPING_LIST,
  SHOPPING_ITEMS_REMAINING,
  PROGRESS_STATS,
  TODAY_CHECKLIST,
  POPULAR_RECIPES,
} from "../data/dashboardData";

// TODO: replace with the signed-in user's real name and goal once the
// Django backend and onboarding submission are wired up.
const USER_NAME = "Grace";
const USER_GOAL = "Eat healthier & manage weight";

export default function DashboardPage() {
  return (
    <DashboardLayout userName={USER_NAME}>
      <div className="mx-auto flex max-w-6xl flex-col gap-5 pt-6 sm:pt-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-display text-3xl text-ink sm:text-4xl">
              Good morning, {USER_NAME} 👋
            </h1>
            <p className="mt-1 text-sm text-inkMuted">
              Here's your personalized meal plan for today.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-forest-light p-4 md:w-72">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-forest text-offwhite">
              <IconLeaf className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-inkMuted">Your goal</p>
              <p className="text-sm font-medium text-ink">{USER_GOAL}</p>
              <button className="mt-1 text-xs font-medium text-forest hover:text-forest-deep">
                Edit goal
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
          <MealsCard meals={TODAY_MEALS} />
          <WeekGlanceCard week={WEEK_PLAN} />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <ShoppingListCard categories={SHOPPING_LIST} itemsRemaining={SHOPPING_ITEMS_REMAINING} />
          <ProgressCard stats={PROGRESS_STATS} />
          <ChecklistCard items={TODAY_CHECKLIST} />
        </div>

        <RecipeRow
          recommended={{ name: "Githeri", minutes: 40, emoji: "🍛" }}
          tip="Adding a source of protein to each meal helps you stay full longer and supports your goals."
          popular={POPULAR_RECIPES}
        />

        <BottomBanner />
      </div>
    </DashboardLayout>
  );
}