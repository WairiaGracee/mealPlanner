import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SectionLabel from "../components/ui/SectionLabel";
import Button from "../components/ui/Button";
import ScrollReveal from "../components/ui/ScrollReveal";
import { holidayPlans } from "../data/holidayPlans";

export default function GatherPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />

      <section className="px-6 pb-8 pt-4 md:px-12">
        <ScrollReveal>
          <SectionLabel>Gather</SectionLabel>
          <h1 className="mt-4 font-display text-4xl text-ink md:text-5xl">
            Meal plans for the days everyone's around the table
          </h1>
          <p className="mt-3 max-w-lg text-sm text-inkMuted">
            Christmas, Easter, Eid, New Year's — the days you're cooking for a
            full house instead of just yourself. These sample plans are
            scaled for hosting; register to size one to your actual guest
            count and dietary needs.
          </p>
        </ScrollReveal>
      </section>

      <section className="px-6 pb-20 md:px-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {holidayPlans.map((plan, i) => (
            <ScrollReveal key={plan.id} delayMs={(i % 3) * 100}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper">
                <div className="aspect-[4/3] w-full overflow-hidden bg-forest-light">
                  {plan.image ? (
                    <img
                      src={plan.image}
                      alt={plan.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="h-full w-full bg-gradient-to-br from-clay/25 via-forest-light to-forest/10"
                      role="img"
                      aria-label={`${plan.name} placeholder image`}
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span className="font-mono text-[11px] uppercase tracking-wide text-forest">
                    {plan.occasion} · {plan.timing}
                  </span>
                  <h3 className="font-display text-xl text-ink">{plan.name}</h3>
                  <p className="flex-1 text-sm text-inkMuted">{plan.description}</p>
                  <p className="mt-1 text-xs font-medium text-clay">{plan.servesNote}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="bg-paper px-6 py-16 md:px-12 md:py-20">
        <ScrollReveal>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            <SectionLabel>Hosting soon?</SectionLabel>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              Tell us the occasion and the headcount
            </h2>
            <p className="max-w-md text-sm text-inkMuted">
              Register and complete onboarding to get a holiday plan sized to
              your household, with a shopping list scaled to how many people
              you're actually feeding.
            </p>
            <Button variant="primary" onClick={() => navigate("/register")}>
              Get started
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}