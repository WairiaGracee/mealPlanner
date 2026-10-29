import RecipeCollectionPage from "../components/collection/RecipeCollectionPage";
import { IconHeart } from "../components/dashboard/icons";

export default function FavouritesPage() {
  return (
    <RecipeCollectionPage
      kind="favourite"
      title="Favorites"
      subtitle="The recipes you love most, all in one place."
      emptyTitle="No favorites yet"
      emptyText="Open any recipe and tap the heart to add it here."
      Icon={IconHeart}
    />
  );
}