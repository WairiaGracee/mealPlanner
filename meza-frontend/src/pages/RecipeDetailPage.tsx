import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ExportMenu from "../components/export/ExportMenu";
import RecipeExportCard from "../components/export/RecipeExportCard";
import {
  IconChevronLeft,
  IconFlame,
  IconStopwatch,
  IconBook,
} from "../components/dashboard/icons";
import { useAuth } from "../context/authContext";
import { ApiError } from "../lib/api";
import { getRecipe, type Recipe } from "../lib/mealplans";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const userName = user?.full_name?.split(" ")[0] ?? "there";

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setError(null);

    getRecipe(id)
      .then((r) => {
        if (!cancelled) setRecipe(r);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setError("Couldn't load this recipe. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout userName={userName}>
        <div className="flex h-64 items-center justify-center text-sm text-inkMuted">
          Loading recipe…
        </div>
      </DashboardLayout>
    );
  }

  if (notFound || error || !recipe) {
    return (
      <DashboardLayout userName={userName}>
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-line bg-paper py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-light text-forest">
            <IconBook className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-display text-xl text-ink">
              {notFound ? "Recipe not found" : "Something went wrong"}
            </h2>
            <p className="mt-1 text-sm text-inkMuted">
              {notFound
                ? "This recipe doesn't exist, or isn't part of any of your meal plans."
                : error}
            </p>
          </div>
          <button
            onClick={() => navigate("/recipes")}
            className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
          >
            Back to recipes
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-3xl flex-col gap-6 pt-6 sm:pt-8">
        <button
          onClick={() => navigate("/recipes")}
          className="flex w-fit items-center gap-1.5 text-sm text-inkMuted transition-colors hover:text-ink"
        >
          <IconChevronLeft className="h-4 w-4" />
          Back to recipes
        </button>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-forest-light text-4xl">
              {recipe.image_url ? (
                <img
                  src={recipe.image_url}
                  alt={recipe.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                recipe.emoji || "🍽️"
              )}
            </span>
            <div>
              <h1 className="font-display text-3xl text-ink">{recipe.name}</h1>
              {recipe.region && <p className="mt-1 text-sm text-inkMuted">{recipe.region}</p>}
            </div>
          </div>

          <ExportMenu
            targetRef={exportRef}
            filename={`meza-recipe-${recipe.name.toLowerCase().replace(/\s+/g, "-")}`}
          />
        </div>

        {recipe.description && (
          <p className="max-w-2xl text-sm leading-relaxed text-inkMuted">{recipe.description}</p>
        )}

        <div className="flex flex-wrap gap-3">
          {recipe.prep_minutes != null && (
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-ink">
              <IconStopwatch className="h-3.5 w-3.5 text-forest" />
              {recipe.prep_minutes} min
            </span>
          )}
          {recipe.calories != null && (
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-ink">
              <IconFlame className="h-3.5 w-3.5 text-clay" />
              {recipe.calories} kcal
            </span>
          )}
          {recipe.protein_g != null && (
            <span className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-ink">
              {recipe.protein_g}g protein
            </span>
          )}
          {recipe.carbs_g != null && (
            <span className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-ink">
              {recipe.carbs_g}g carbs
            </span>
          )}
          {recipe.fat_g != null && (
            <span className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-ink">
              {recipe.fat_g}g fat
            </span>
          )}
        </div>

        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-forest-light/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-forest"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {recipe.ingredients.length > 0 && (
            <div className="rounded-2xl border border-line bg-paper p-5">
              <h2 className="font-robotoCondensed text-sm font-semibold uppercase tracking-[0.1em] text-forest">
                Ingredients
              </h2>
              <ul className="mt-3 flex flex-col gap-1.5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="text-sm text-ink">
                    • {ing.name}
                    {ing.quantity ? ` — ${ing.quantity}` : ""}
                    {ing.unit ? ` ${ing.unit}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recipe.steps.length > 0 && (
            <div className="rounded-2xl border border-line bg-paper p-5">
              <h2 className="font-robotoCondensed text-sm font-semibold uppercase tracking-[0.1em] text-forest">
                Method
              </h2>
              <ol className="mt-3 flex flex-col gap-2.5">
                {recipe.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-ink">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-forest text-[11px] font-medium text-offwhite">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      <RecipeExportCard ref={exportRef} recipe={recipe} />
    </DashboardLayout>
  );
}