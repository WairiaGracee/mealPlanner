import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SectionLabel from "../components/ui/SectionLabel";
// import MealPlanRow from "../components/landing/MealPlanRow";
import { mealPlanPreviews } from "../data/mealPlans";

const TONES = ["gold", "clay", "sukuma"] as const;

export default function SampleMealPlansPage() {
  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar />

      <section className="px-6 pb-8 pt-4 md:px-12">
        <SectionLabel>Sample meal plans</SectionLabel>
        <h1 className="mt-4 font-display text-4xl text-cream md:text-5xl">
          Browse full weekly plans
        </h1>
        <p className="mt-3 max-w-lg text-sm text-cream/70">
          These are examples of the plans our AI generates. Once you sign up,
          your own plan is built around your height, weight, goals and health
          profile instead of a fixed template like these.
        </p>
      </section>

      {/* <section className="px-6 pb-20 md:px-12">
        {mealPlanPreviews.map((plan, i) => (
          <MealPlanRow
            key={plan.id}
            plan={plan}
            reversed={i % 2 === 1}
            tone={TONES[i % TONES.length]}
          />
        ))}
      </section> */}

      {/*
        Next: nutrition blog listing will likely live at /blog, cross-linked
        from here (e.g. "Read the nutrition notes behind this plan").
      */}

      <Footer />
    </div>
  );
}