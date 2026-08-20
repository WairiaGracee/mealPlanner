import { forwardRef } from "react";
import Logo from "../ui/Logo";
import { IconFlame, IconStopwatch } from "../dashboard/icons";
import type { Recipe } from "../../lib/mealplans";

interface RecipeExportCardProps {
  recipe: Recipe;
}

const RecipeExportCard = forwardRef<HTMLDivElement, RecipeExportCardProps>(
  function RecipeExportCard({ recipe }, ref) {
    return (
      <div className="fixed left-0 top-0 h-0 w-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
      <div ref={ref} className="w-[640px] bg-offwhite">
        <div className="flex flex-col gap-6 p-10">
          <div className="flex items-center justify-between border-b border-line pb-6">
            <Logo className="h-10 w-auto" />
            <p className="text-xs uppercase tracking-[0.12em] text-inkMuted">Recipe Card</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-forest-light text-3xl">
              {recipe.image_url ? (
                <img
                  src={recipe.image_url}
                  alt={recipe.name}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                recipe.emoji || "🍽️"
              )}
            </span>
            <div>
              <h1 className="font-display text-2xl text-ink">{recipe.name}</h1>
              {recipe.region && <p className="text-sm text-inkMuted">{recipe.region}</p>}
            </div>
          </div>

          {recipe.description && <p className="text-sm text-inkMuted">{recipe.description}</p>}

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

          <div className="rounded-xl bg-forest-light/50 px-5 py-3 text-center text-xs text-inkMuted">
            Made with Meza — Kenyan meal planning, personalized to you.
          </div>
        </div>
      </div>
      </div>
    );
  }
);

export default RecipeExportCard;