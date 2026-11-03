import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { IconHome } from "../components/dashboard/icons";
import { useAuth } from "../context/authContext";
import { createRecipe } from "../lib/mealplans";

const EMOJIS = ["🍲", "🥘", "🍛", "🥗", "🍳", "🍠", "🌽", "🥬", "🍗", "🐟"];

interface IngredientRow {
  name: string;
  quantity: string;
}

const inputClass =
  "w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-forest";
const labelClass = "text-xs font-medium uppercase tracking-wide text-inkMuted";

export default function WriteRecipePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.full_name?.split(" ")[0] ?? "there";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [prepMinutes, setPrepMinutes] = useState("");
  const [calories, setCalories] = useState("");
  const [emoji, setEmoji] = useState("");
  const [ingredients, setIngredients] = useState<IngredientRow[]>([{ name: "", quantity: "" }]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateIngredient(index: number, field: keyof IngredientRow, value: string) {
    setIngredients((rows) => rows.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }

  function removeIngredient(index: number) {
    setIngredients((rows) => (rows.length === 1 ? rows : rows.filter((_, i) => i !== index)));
  }

  function updateStep(index: number, value: string) {
    setSteps((rows) => rows.map((s, i) => (i === index ? value : s)));
  }

  function removeStep(index: number) {
    setSteps((rows) => (rows.length === 1 ? rows : rows.filter((_, i) => i !== index)));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const cleanIngredients = ingredients
      .map((i) => ({ name: i.name.trim(), quantity: i.quantity.trim() }))
      .filter((i) => i.name);
    const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);

    if (!name.trim()) return setError("Please give your recipe a name.");
    if (cleanIngredients.length === 0) return setError("Add at least one ingredient.");
    if (cleanSteps.length === 0) return setError("Add at least one step.");

    setSaving(true);
    try {
      await createRecipe({
        name: name.trim(),
        description: description.trim(),
        region: region.trim(),
        prep_minutes: prepMinutes ? Number(prepMinutes) : null,
        calories: calories ? Number(calories) : null,
        emoji,
        ingredients: cleanIngredients,
        steps: cleanSteps,
      });
      navigate("/saved-meals");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save your recipe. Please try again.");
      setSaving(false);
    }
  }

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-2xl flex-col gap-5 pt-0">
        <div>
          <nav className="flex items-center gap-2 text-xs text-inkMuted">
            <IconHome className="h-3.5 w-3.5" />
            <button onClick={() => navigate("/dashboard")} className="hover:text-forest">
              Kitchen
            </button>
            <span>/</span>
            <button onClick={() => navigate("/recipes")} className="hover:text-forest">
              Recipes
            </button>
            <span>/</span>
            <span className="text-ink">Write a recipe</span>
          </nav>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Write a recipe</h1>
          <p className="mt-1 text-sm text-inkMuted">
            Add a family favourite. It's saved to your Saved Meals automatically.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-2xl border border-line bg-paper p-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="recipe-name" className={labelClass}>Recipe name</label>
            <input
              id="recipe-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={150}
              placeholder="e.g. Mum's githeri"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="recipe-description" className={labelClass}>Short description (optional)</label>
            <textarea
              id="recipe-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="What makes this dish special?"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="recipe-region" className={labelClass}>Region (optional)</label>
              <input
                id="recipe-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                maxLength={100}
                placeholder="e.g. Central"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="recipe-prep" className={labelClass}>Prep time, min</label>
              <input
                id="recipe-prep"
                type="number"
                min={1}
                max={1440}
                value={prepMinutes}
                onChange={(e) => setPrepMinutes(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="recipe-calories" className={labelClass}>Calories (optional)</label>
              <input
                id="recipe-calories"
                type="number"
                min={1}
                max={5000}
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className={labelClass}>Pick an icon (optional)</span>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setEmoji(emoji === em ? "" : em)}
                  aria-pressed={emoji === em}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xl transition-colors ${
                    emoji === em ? "border-forest bg-forest-light" : "border-line bg-paper hover:bg-forest-light"
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className={labelClass}>Ingredients</span>
            {ingredients.map((row, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={row.quantity}
                  onChange={(e) => updateIngredient(i, "quantity", e.target.value)}
                  maxLength={50}
                  placeholder="Amount, e.g. 2 cups"
                  aria-label={`Ingredient ${i + 1} amount`}
                  className={`${inputClass} w-2/5`}
                />
                <input
                  value={row.name}
                  onChange={(e) => updateIngredient(i, "name", e.target.value)}
                  maxLength={100}
                  placeholder="Ingredient"
                  aria-label={`Ingredient ${i + 1} name`}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  aria-label={`Remove ingredient ${i + 1}`}
                  className="px-2 text-lg text-inkMuted transition-colors hover:text-clay"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setIngredients((rows) => [...rows, { name: "", quantity: "" }])}
              className="self-start text-sm text-forest transition-colors hover:text-forest-deep"
            >
              + Add ingredient
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className={labelClass}>Steps</span>
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2">
                <span className="mt-2.5 w-5 flex-shrink-0 text-sm text-inkMuted">{i + 1}.</span>
                <textarea
                  value={step}
                  onChange={(e) => updateStep(i, e.target.value)}
                  rows={2}
                  maxLength={1000}
                  placeholder="Describe this step"
                  aria-label={`Step ${i + 1}`}
                  className={`${inputClass} resize-none`}
                />
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  aria-label={`Remove step ${i + 1}`}
                  className="px-2 text-lg text-inkMuted transition-colors hover:text-clay"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSteps((rows) => [...rows, ""])}
              className="self-start text-sm text-forest transition-colors hover:text-forest-deep"
            >
              + Add step
            </button>
          </div>

          {error && <p className="text-sm text-clay">{error}</p>}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save recipe"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/recipes")}
              className="rounded-full border border-line bg-paper px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-forest-light"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}