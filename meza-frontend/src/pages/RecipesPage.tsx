import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ExportMenu from "../components/export/ExportMenu";
import RecipeExportCard from "../components/export/RecipeExportCard";
import {
  IconBook,
  IconChevronDown,
  IconFlame,
  IconGrid,
  IconHome,
  IconLeaf,
  IconPlus,
  IconSearch,
  IconStopwatch,
  IconSun,
} from "../components/dashboard/icons";
import { IconForkSpoon, IconMoon } from "../components/dashboard/extraicons";
import { ACCENT } from "../components/dashboard/accents";
import { useAuth } from "../context/authContext";
import { getRecipes, type Recipe } from "../lib/mealplans";

/* ---------- types & helpers ---------- */

// The backend adds `category` (the meal slot a recipe was planned for).
type RecipeRow = Recipe & { category?: string };

type Filter = { kind: "all" } | { kind: "category"; value: string } | { kind: "tag"; value: string };
type Sort = "recent" | "az" | "quickest" | "lightest";

const CATEGORY_ORDER = ["breakfast", "lunch", "dinner", "snack"];
const CATEGORY_LABEL: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};
const CATEGORY_STYLE = {
  breakfast: { Icon: IconSun, accent: ACCENT.peach },
  lunch: { Icon: IconSun, accent: ACCENT.sage },
  dinner: { Icon: IconMoon, accent: ACCENT.lavender },
  snack: { Icon: IconLeaf, accent: ACCENT.rose },
} as const;

function categoryStyle(category?: string) {
  return (
    CATEGORY_STYLE[category as keyof typeof CATEGORY_STYLE] ?? {
      Icon: IconForkSpoon,
      accent: ACCENT.sky,
    }
  );
}

function prettyTag(tag: string): string {
  const s = tag.replace(/[-_]+/g, " ").trim().toLowerCase();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

/**
 * An estimate, not stored data: recipes don't have a difficulty field yet,
 * so this is worked out from prep time and number of steps.
 */
function levelOf(r: Recipe): { label: string; bars: 1 | 2 | 3 } {
  const load = (r.prep_minutes ?? 0) + (r.steps?.length ?? 0) * 2;
  if (load <= 30) return { label: "Easy", bars: 1 };
  if (load <= 55) return { label: "Medium", bars: 2 };
  return { label: "Hard", bars: 3 };
}

const COLUMNS =
  "lg:grid-cols-[minmax(0,2.1fr)_104px_minmax(0,2.6fr)_96px_104px_96px_32px]";

/* ---------- page ---------- */

export default function RecipesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<RecipeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingRecipe, setExportingRecipe] = useState<Recipe | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>({ kind: "all" });
  const [sort, setSort] = useState<Sort>("recent");
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getRecipes()
      .then((r) => {
        if (!cancelled) setRecipes(r as RecipeRow[]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const userName = user?.full_name?.split(" ")[0] ?? "there";

  const categories = useMemo(
    () => CATEGORY_ORDER.filter((c) => recipes.some((r) => r.category === c)),
    [recipes]
  );

  // Up to three of the most common recipe tags become extra filter chips.
  const topTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of recipes) {
      for (const raw of r.tags ?? []) {
        const t = prettyTag(raw);
        if (t) counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([t]) => t);
  }, [recipes]);

  const avgPrep = useMemo(() => {
    const withPrep = recipes.filter((r) => r.prep_minutes);
    if (withPrep.length === 0) return null;
    return Math.round(
      withPrep.reduce((sum, r) => sum + (r.prep_minutes ?? 0), 0) / withPrep.length
    );
  }, [recipes]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = recipes.filter((r) => {
      if (filter.kind === "category" && r.category !== filter.value) return false;
      if (filter.kind === "tag" && !(r.tags ?? []).some((t) => prettyTag(t) === filter.value)) {
        return false;
      }
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q) ||
        (r.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
        (r.ingredients ?? []).some((i) => i.name.toLowerCase().includes(q))
      );
    });
    if (sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "quickest") {
      list = [...list].sort((a, b) => (a.prep_minutes ?? 999) - (b.prep_minutes ?? 999));
    }
    if (sort === "lightest") {
      list = [...list].sort((a, b) => (a.calories ?? 99999) - (b.calories ?? 99999));
    }
    return list; // "recent" keeps the API order (newest first)
  }, [recipes, filter, query, sort]);

  if (loading) {
    return (
      <DashboardLayout userName={userName}>
        <div className="flex h-64 items-center justify-center text-sm text-inkMuted">
          Loading recipes…
        </div>
      </DashboardLayout>
    );
  }

  const isActive = (f: Filter) =>
    f.kind === filter.kind && (f.kind === "all" || f.value === (filter as { value: string }).value);

  const chips: { label: string; filter: Filter }[] = [
    { label: "All recipes", filter: { kind: "all" } },
    ...categories.map((c) => ({
      label: CATEGORY_LABEL[c],
      filter: { kind: "category", value: c } as Filter,
    })),
    ...topTags.map((t) => ({ label: t, filter: { kind: "tag", value: t } as Filter })),
  ];

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-6xl flex-col gap-5 pt-0">
        {/* Breadcrumb + heading */}
        <div>
          <nav className="flex items-center gap-2 text-xs text-inkMuted">
            <IconHome className="h-3.5 w-3.5" />
            <button onClick={() => navigate("/dashboard")} className="hover:text-forest">
              Kitchen
            </button>
            <span>/</span>
            <span className="text-ink">Recipes</span>
          </nav>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Your recipes</h1>
          <p className="mt-1 text-sm text-inkMuted">
            Organize your meals, plan ahead, and find your next favorite.
          </p>
        </div>

        {/* Search + add */}
        <div className="flex items-center gap-3">
          <label className="flex flex-1 items-center gap-3 rounded-full border border-line bg-paper px-5 py-3 text-inkMuted transition-colors focus-within:border-forest">
            <IconSearch className="h-4 w-4 flex-shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes or ingredients..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-inkMuted"
            />
          </label>
          <button
            disabled
            title="Adding your own recipes is coming soon"
            className="flex flex-shrink-0 items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-medium text-offwhite opacity-60"
          >
            <IconPlus className="h-4 w-4" strokeWidth={2} />
            Add recipe
          </button>
        </div>

        {/* Filter chips */}
        {recipes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => setFilter(chip.filter)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  isActive(chip.filter)
                    ? "border-forest bg-forest text-offwhite"
                    : "border-line bg-paper text-ink hover:bg-forest-light"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-forest-light/50 py-4">
          <Stat icon={<IconBook className="h-5 w-5" />} value={String(recipes.length)} label="Recipes" />
          <Stat
            icon={<IconGrid className="h-5 w-5" />}
            value={categories.length > 0 ? String(categories.length) : "—"}
            label="Categories"
          />
          <Stat
            icon={<IconStopwatch className="h-5 w-5" />}
            value={avgPrep !== null ? String(avgPrep) : "—"}
            label="Avg. prep (min)"
          />
        </div>

        {recipes.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-line bg-paper px-8 py-16 text-center">
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
          <div className="flex flex-col gap-3">
            {/* Sort */}
            <div className="flex justify-end">
              <label className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="appearance-none rounded-lg border border-line bg-paper py-2 pl-4 pr-9 text-xs font-medium text-ink outline-none focus:border-forest"
                >
                  <option value="recent">Recently added</option>
                  <option value="az">Name (A–Z)</option>
                  <option value="quickest">Quickest prep</option>
                  <option value="lightest">Lowest calories</option>
                </select>
                <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-inkMuted" />
              </label>
            </div>

            {/* Column headings */}
            <div
              className={`hidden items-center gap-4 px-4 text-[11px] font-medium uppercase tracking-[0.08em] text-inkMuted lg:grid ${COLUMNS}`}
            >
              <span>Recipe</span>
              <span>Category</span>
              <span>Description</span>
              <span>Prep</span>
              <span>Calories</span>
              <span>Level</span>
              <span />
            </div>

            {visible.length === 0 && (
              <p className="rounded-2xl border border-line bg-paper py-10 text-center text-sm text-inkMuted">
                No recipes match your search.
              </p>
            )}

            {visible.map((recipe) => (
              <RecipeRowItem
                key={recipe.id}
                recipe={recipe}
                onOpen={() => navigate(`/recipes/${recipe.id}`)}
                exportRef={exportRef}
                onBeforeExport={() => flushSync(() => setExportingRecipe(recipe))}
              />
            ))}
          </div>
        )}
      </div>

      {exportingRecipe && <RecipeExportCard ref={exportRef} recipe={exportingRecipe} />}
    </DashboardLayout>
  );
}

/* ---------- pieces ---------- */

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 px-2">
      <span className="text-forest">{icon}</span>
      <div>
        <p className="font-display text-xl font-semibold leading-tight text-ink">{value}</p>
        <p className="text-[11px] text-inkMuted">{label}</p>
      </div>
    </div>
  );
}

function Pill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-forest-light/60 px-2.5 py-1 text-[11px] text-ink">
      <span className="text-inkMuted">{icon}</span>
      {children}
    </span>
  );
}

function LevelBars({ bars }: { bars: 1 | 2 | 3 }) {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden="true">
      <rect x="0.5" y="7" width="2.5" height="4.5" rx="0.6" opacity={bars >= 1 ? 1 : 0.25} />
      <rect x="4.7" y="4" width="2.5" height="7.5" rx="0.6" opacity={bars >= 2 ? 1 : 0.25} />
      <rect x="8.9" y="0.5" width="2.5" height="11" rx="0.6" opacity={bars >= 3 ? 1 : 0.25} />
    </svg>
  );
}

function RecipeRowItem({
  recipe,
  onOpen,
  exportRef,
  onBeforeExport,
}: {
  recipe: RecipeRow;
  onOpen: () => void;
  exportRef: React.RefObject<HTMLDivElement | null>;
  onBeforeExport: () => void;
}) {
  const { Icon, accent } = categoryStyle(recipe.category);
  const categoryLabel = recipe.category ? CATEGORY_LABEL[recipe.category] ?? recipe.category : null;
  const level = levelOf(recipe);

  const categoryPill = categoryLabel && (
    <span
      className="inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: accent.bg, color: accent.ink }}
    >
      {categoryLabel}
    </span>
  );

  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen();
      }}
      className={`grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 rounded-xl border border-line bg-paper px-4 py-3 shadow-sm transition-colors hover:border-forest/40 hover:bg-forest-light/20 lg:gap-y-0 ${COLUMNS}`}
    >
      {/* Recipe */}
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: accent.bg, color: accent.fg }}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{recipe.name}</p>
          <div className="mt-0.5 lg:hidden">{categoryPill}</div>
        </div>
      </div>

      {/* Menu (top-right on small screens, last column on large) */}
      <div className="lg:order-last" onClick={(e) => e.stopPropagation()}>
        <ExportMenu
          compact
          moreIcon
          targetRef={exportRef}
          filename={`intentionallyWell-recipe-${recipe.name.toLowerCase().replace(/\s+/g, "-")}`}
          onBeforeOpen={onBeforeExport}
        />
      </div>

      {/* Category */}
      <div className="hidden lg:block">{categoryPill ?? <span className="text-xs text-inkMuted">—</span>}</div>

      {/* Description */}
      <p className="col-span-2 line-clamp-2 text-xs leading-relaxed text-inkMuted lg:col-span-1">
        {recipe.description || "—"}
      </p>

      {/* Prep / calories / level */}
      <div className="col-span-2 flex flex-wrap items-center gap-2 lg:contents">
        <div>
          {recipe.prep_minutes ? (
            <Pill icon={<IconStopwatch className="h-3 w-3" />}>{recipe.prep_minutes} min</Pill>
          ) : (
            <span className="text-xs text-inkMuted">—</span>
          )}
        </div>
        <div>
          {recipe.calories ? (
            <Pill icon={<IconFlame className="h-3 w-3" />}>{recipe.calories} kcal</Pill>
          ) : (
            <span className="text-xs text-inkMuted">—</span>
          )}
        </div>
        <div>
          <Pill icon={<LevelBars bars={level.bars} />}>{level.label}</Pill>
        </div>
      </div>
    </div>
  );
}