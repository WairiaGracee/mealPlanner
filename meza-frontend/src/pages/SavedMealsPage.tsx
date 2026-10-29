import RecipeCollectionPage from "../components/collection/RecipeCollectionPage";
import { IconBookmark } from "../components/dashboard/icons";

export default function SavedMealsPage() {
  return (
    <RecipeCollectionPage
      kind="saved"
      title="Saved Meals"
      subtitle="Recipes you've set aside to cook later."
      emptyTitle="Nothing saved yet"
      emptyText="Open any recipe and tap Save to keep it here."
      Icon={IconBookmark}
    />
  );
}