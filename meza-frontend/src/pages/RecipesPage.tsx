import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { IconBook, IconFlame, IconStopwatch } from "../components/dashboard/icons";
import { useAuth } from "../context/authContext";
import { getRecipes, type Recipe } from "../lib/mealplans";

export default function RecipesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const avgPrep = useMemo(() => {
    const withPrep = recipes.filter((r) => r.prep_minutes);
    if (withPrep.length === 0) return null;
    return Math.round(
      withPrep.reduce((sum, r) => sum + (r.prep_minutes ?? 0), 0) / withPrep.length
    );
  }, [recipes]);

  if (loading) {
    return (
      <DashboardLayout userName={userName}>
        <div className="flex h-64 items-center justify-center text-sm text-inkMuted">
          Loading recipes…
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 pt-6 sm:pt-8">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-display text-3xl text-ink">Your recipes</h1>
            <p className="mt-1 text-sm text-inkMuted">
              Every dish from your meal plans, saved in one place.
            </p>
            <div className="mt-2 h-[3px] w-14 rounded-full bg-clay" />
          </div>

          <div className="flex flex-wrap items-stretch gap-3">
            <div className="flex items-center divide-x divide-line rounded-2xl border border-line bg-paper px-5 py-3">
              <div className="pr-5 text-center">
                <p className="font-display text-xl text-ink">{recipes.length}</p>
                <p className="text-[11px] text-inkMuted">Recipes saved</p>
              </div>
              <div className="pl-5 text-center">
                <p className="font-display text-xl text-ink">{avgPrep ?? "—"}</p>
                <p className="flex items-center justify-center gap-1 text-[11px] text-inkMuted">
                  <IconStopwatch className="h-3 w-3 text-forest" />
                  Avg. min prep
                </p>
              </div>
            </div>

            <div className="flex max-w-xs items-center gap-3 rounded-2xl border border-line bg-forest-light/50 px-4 py-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                <IconBook className="h-5 w-5" />
              </span>
              <p className="text-xs text-ink">
                <strong className="font-robotoCondensed font-medium">
                  Your growing cookbook.
                </strong>
                <br />
                Recipes are added automatically as new meal plans are generated.
              </p>
            </div>
          </div>
        </div>

        {/* Grid / empty state */}
        {recipes.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-line bg-paper py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-light text-forest">
              <IconBook className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-xl text-ink">No recipes yet</h2>
              <p className="mt-1 text-sm text-inkMuted">
                Generate a meal plan to start building your collection.
              </p>
            </div>
            <button
              onClick={() => navigate("/onboarding")}
              className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
            >
              Start onboarding
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="group overflow-hidden rounded-2xl border border-line bg-paper p-4 transition-colors hover:border-forest/40 hover:bg-forest-light/20"
              >
                <div className="flex h-28 items-center justify-center overflow-hidden rounded-xl bg-forest-light text-4xl">
                  {recipe.image_url ? (
                    <img
                      src={recipe.image_url}
                      alt={recipe.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    recipe.emoji || "🍽️"
                  )}
                </div>
                <p className="mt-3 text-sm font-medium leading-snug text-ink">{recipe.name}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-inkMuted">
                  {recipe.prep_minutes && (
                    <span className="flex items-center gap-1">
                      <IconStopwatch className="h-3 w-3 text-forest" />
                      {recipe.prep_minutes} min
                    </span>
                  )}
                  {recipe.calories && (
                    <span className="flex items-center gap-1">
                      <IconFlame className="h-3 w-3 text-clay" />
                      {recipe.calories} kcal
                    </span>
                  )}
                </div>
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