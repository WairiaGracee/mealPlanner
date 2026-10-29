import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../dashboard/DashboardLayout";
import { IconFlame, IconHome, IconStopwatch } from "../dashboard/icons";
import type { IconComponent } from "../dashboard/icons";
import { useAuth } from "../../context/authContext";
import {
  getCollection,
  toggleCollection,
  type CollectionKind,
  type Recipe,
} from "../../lib/mealplans";

interface Props {
  kind: CollectionKind;
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyText: string;
  Icon: IconComponent;
}

export default function RecipeCollectionPage({
  kind,
  title,
  subtitle,
  emptyTitle,
  emptyText,
  Icon,
}: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userName = user?.full_name?.split(" ")[0] ?? "there";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getCollection(kind)
      .then((r) => {
        if (!cancelled) setRecipes(r);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this list. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [kind]);

  async function remove(recipe: Recipe) {
    const previous = recipes;
    setRecipes((list) => list.filter((r) => r.id !== recipe.id));
    try {
      await toggleCollection(recipe.id, kind);
    } catch {
      setRecipes(previous);
      setError("Couldn't remove that recipe. Please try again.");
    }
  }

  if (loading) {
    return (
      <DashboardLayout userName={userName}>
        <div className="flex h-64 items-center justify-center text-sm text-inkMuted">
          Loading…
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-6xl flex-col gap-5 pt-0">
        <div>
          <nav className="flex items-center gap-2 text-xs text-inkMuted">
            <IconHome className="h-3.5 w-3.5" />
            <button onClick={() => navigate("/dashboard")} className="hover:text-forest">
              Kitchen
            </button>
            <span>/</span>
            <span className="text-ink">{title}</span>
          </nav>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{title}</h1>
          <p className="mt-1 text-sm text-inkMuted">{subtitle}</p>
        </div>

        {error && (
          <p className="rounded-xl border border-line bg-paper px-4 py-3 text-sm text-clay">
            {error}
          </p>
        )}

        {recipes.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 pt-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-light text-forest">
              <Icon className="h-6 w-6" />
            </span>
            <h2 className="font-display text-xl text-ink">{emptyTitle}</h2>
            <p className="text-sm text-inkMuted">{emptyText}</p>
            <button
              onClick={() => navigate("/recipes")}
              className="mt-2 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
            >
              Browse recipes
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <div
                key={r.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-shadow hover:shadow-md"
              >
                <button onClick={() => navigate(`/recipes/${r.id}`)} className="text-left">
                  <div className="flex h-36 items-center justify-center overflow-hidden bg-forest-light text-5xl">
                    {r.image_url ? (
                      <img src={r.image_url} alt={r.name} className="h-full w-full object-cover" />
                    ) : (
                      r.emoji || "🍽️"
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-ink">{r.name}</p>
                    {r.region && <p className="mt-0.5 text-xs text-inkMuted">{r.region}</p>}
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink">
                      {r.prep_minutes != null && (
                        <span className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1">
                          <IconStopwatch className="h-3 w-3 text-forest" />
                          {r.prep_minutes} min
                        </span>
                      )}
                      {r.calories != null && (
                        <span className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1">
                          <IconFlame className="h-3 w-3 text-clay" />
                          {r.calories} kcal
                        </span>
                      )}
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => remove(r)}
                  className="mt-auto flex items-center justify-center gap-1.5 border-t border-line px-4 py-2.5 text-xs text-inkMuted transition-colors hover:bg-forest-light hover:text-ink"
                >
                  <Icon className="h-3.5 w-3.5" fill="currentColor" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}