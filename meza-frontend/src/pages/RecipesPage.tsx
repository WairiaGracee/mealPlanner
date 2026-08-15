import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useAuth } from "../context/authContext";
import { getRecipes, type Recipe } from "../lib/mealplans";

export default function RecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getRecipes()
      .then((r) => {
        if (!cancelled) setRecipes(r);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const userName = user?.full_name?.split(" ")[0] ?? "there";

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 pt-6 sm:pt-8">
        <h1 className="font-display text-3xl text-ink">Your recipes</h1>

        {loading ? (
          <div className="flex h-64 items-center justify-center text-sm text-inkMuted">
            Loading recipes…
          </div>
        ) : recipes.length === 0 ? (
          <p className="text-sm text-inkMuted">
            No recipes yet — generate a meal plan to start building your collection.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="rounded-2xl border border-line bg-paper p-4">
                <div className="flex h-28 items-center justify-center overflow-hidden rounded-xl bg-forest-light text-4xl">
                  {recipe.image_url ? (
                    <img
                      src={recipe.image_url}
                      alt={recipe.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    recipe.emoji || "🍽️"
                  )}
                </div>
                <p className="mt-3 text-sm font-medium leading-snug text-ink">{recipe.name}</p>
                <p className="text-xs text-inkMuted">
                  {recipe.prep_minutes ? `${recipe.prep_minutes} min` : ""}
                  {recipe.prep_minutes && recipe.calories ? " · " : ""}
                  {recipe.calories ? `${recipe.calories} kcal` : ""}
                </p>
                {recipe.description && (
                  <p className="mt-2 line-clamp-2 text-xs text-inkMuted">{recipe.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}