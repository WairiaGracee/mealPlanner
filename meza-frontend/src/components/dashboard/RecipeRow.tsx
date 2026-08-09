import type { RecipeSummary } from "../../types";
import { IconLeaf } from "./icons";

interface RecipeRowProps {
  recommended: RecipeSummary;
  tip: string;
  popular: RecipeSummary[];
}

export default function RecipeRow({ recommended, tip, popular }: RecipeRowProps) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_2fr]">
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-paper p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-inkMuted">
          Recommended for you
        </p>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-forest-light text-3xl">
            {recommended.emoji}
          </div>
          <div className="flex-1">
            <p className="text-sm text-ink">
              Try {recommended.name} for a high fibre, protein boost.
            </p>
            <button className="mt-2 rounded-full bg-forest px-4 py-1.5 text-xs font-medium text-offwhite transition-colors hover:bg-forest-deep">
              View recipe
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-forest-light p-3">
          <IconLeaf className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest" />
          <div>
            <p className="text-xs font-medium text-ink">Did you know?</p>
            <p className="mt-0.5 text-xs text-inkMuted">{tip}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-paper p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-ink">Popular Kenyan recipes</h2>
          <button className="text-sm font-medium text-forest hover:text-forest-deep">
            View all recipes →
          </button>
        </div>

        <div className="mt-4 flex gap-4 overflow-x-auto pb-1">
          {popular.map((recipe) => (
            <div key={recipe.name} className="w-32 flex-shrink-0">
              <div className="flex h-24 w-32 items-center justify-center rounded-xl bg-forest-light text-4xl">
                {recipe.emoji}
              </div>
              <p className="mt-2 text-sm font-medium text-ink">{recipe.name}</p>
              <p className="text-xs text-inkMuted">{recipe.minutes} min</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}