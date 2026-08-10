import { Link, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SectionLabel from "../components/ui/SectionLabel";
import { mealPlanPreviews } from "../data/mealPlans";

export default function MealPlanDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const plan = mealPlanPreviews.find((p) => p.slug === slug);

  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />

      <section className="px-6 py-16 md:px-12">
        {plan ? (
          <>
            <SectionLabel>{`${plan.tag} · ${plan.region}`}</SectionLabel>
            <h1 className="mt-4 font-display text-4xl text-ink md:text-5xl">
              {plan.name}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-inkMuted">
              {plan.description}
            </p>

            {/*
              TODO: this is a placeholder. The full detail view will show
              a day-by-day breakdown, recipes per meal, and the generated
              grocery list once that part of the system is built.
            */}
            <div className="mt-8 rounded-2xl border border-line p-6 text-sm text-inkMuted">
              Full day-by-day breakdown, recipes, and the grocery list for
              this plan are coming next.
            </div>
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl text-ink">
              We couldn&rsquo;t find that plan
            </h1>
            <Link
              to="/meal-plans"
              className="mt-4 inline-block text-sm text-gold hover:text-ink"
            >
              ← Back to all meal plans
            </Link>
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}