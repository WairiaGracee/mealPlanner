import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SectionLabel from "../components/ui/SectionLabel";
import Button from "../components/ui/Button";
import ScrollReveal from "../components/ui/ScrollReveal";
import { guideRecipes, nutritionTips } from "../data/recipeGuide";

export default function RecipeGuidePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />

      <section className="px-6 pb-8 pt-4 md:px-12">
        <ScrollReveal>
          <SectionLabel>Recipes & nutrition</SectionLabel>
          <h1 className="mt-4 font-display text-4xl text-ink md:text-5xl">
            A few recipes, and the thinking behind them
          </h1>
          <p className="mt-3 max-w-lg text-sm text-inkMuted">
            These are examples pulled from our library — the same dishes,
            with a short note on why each one is built the way it is.
            Register to get a full week chosen for your goal, not just a
            sample.
          </p>
        </ScrollReveal>
      </section>

      <section className="px-6 pb-16 md:px-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guideRecipes.map((recipe, i) => (
            <ScrollReveal key={recipe.id} delayMs={(i % 3) * 100}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper">
                <div className="aspect-[4/3] w-full overflow-hidden bg-forest-light">
                  {recipe.image ? (
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="h-full w-full bg-gradient-to-br from-sukuma/25 via-forest-light to-forest/10"
                      role="img"
                      aria-label={`${recipe.name} placeholder image`}
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span className="font-mono text-[11px] uppercase tracking-wide text-forest">
                    {recipe.region} · {recipe.tag}
                  </span>
                  <h3 className="font-display text-xl text-ink">{recipe.name}</h3>
                  <p className="text-sm text-inkMuted">{recipe.description}</p>
                  <p className="mt-2 rounded-lg bg-forest-light/50 px-3 py-2 text-xs text-forest-deep">
                    {recipe.nutritionNote}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-paper px-6 py-16 md:px-12 md:py-20">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Why the recipes look like this</SectionLabel>
            <h2 className="mt-4 font-display text-3xl text-ink md:text-4xl">
              Nutrition advice, in plain terms
            </h2>
          </div>
        </ScrollReveal>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {nutritionTips.map((tip, i) => (
            <ScrollReveal key={tip.id} delayMs={(i % 2) * 100}>
              <div className="h-full rounded-2xl border border-line bg-offwhite p-6">
                <h3 className="font-display text-lg text-ink">{tip.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-inkMuted">{tip.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 md:py-20">
        <ScrollReveal>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
            <SectionLabel>Why register</SectionLabel>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              These recipes are just a sample of your future plan
            </h2>
            <p className="max-w-md text-sm text-inkMuted">
              Once you register and complete onboarding, every recipe and
              meal plan you get is chosen around your own goal, household,
              diet style, allergies, cooking time and budget — not picked
              from a general list.
            </p>
            <Button variant="primary" onClick={() => navigate("/register")}>
              Get your first plan
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}