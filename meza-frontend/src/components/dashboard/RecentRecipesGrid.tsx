import type { RecipeSummary } from "../../types";

interface RecentRecipesGridProps {
  recipes: RecipeSummary[];
}

export default function RecentRecipesGrid({ recipes }: RecentRecipesGridProps) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Recently viewed recipes</h2>
        <button className="text-sm font-medium text-forest hover:text-forest-deep">
          View all recipes →
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {recipes.map((recipe) => (
          <div key={recipe.name} className="group">
            <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-xl bg-forest-light text-4xl sm:h-32">
              <span aria-hidden="true">{recipe.emoji}</span>
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              <button
                aria-label="Save recipe"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-paper/90 text-sm text-inkMuted transition-colors hover:text-forest"
              >
                🔖
              </button>
            </div>
            <p className="mt-2 text-sm font-medium leading-snug text-ink">{recipe.name}</p>
            <p className="text-xs text-inkMuted">{recipe.minutes} min</p>
          </div>
        ))}
      </div>
    </div>
  );
}