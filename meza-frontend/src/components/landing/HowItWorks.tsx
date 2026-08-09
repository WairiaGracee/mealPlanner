import type { Step } from "../../types";
import SectionLabel from "../ui/SectionLabel";
import ScrollReveal from "../ui/ScrollReveal";
// import Button from "../ui/Button";

const steps: Step[] = [
  {
    id: "step-1",
    number: "01",
    title: "Create An Account",
    description:
       "Sign up to unlock a personalized nutrition experience tailored to your lifestyle. Your account keeps your meal plans, preferences, and progress securely in one place.",
  },
  {
    id: "step-2",
    number: "02",
    title: "Get your weekly plan",
    description:
       "Receive a personalized weekly meal plan designed around your health goals, dietary preferences, and lifestyle. Every plan is carefully crafted by a nutritionist to make healthy eating simple and enjoyable.",
  },
  {
    id: "step-3",
    number: "03",
    title: "Shop, cook, and stay on track",
    description:
       "Use your personalized shopping list to buy exactly what you need and prepare delicious, nutritious meals. Stay consistent by following your plan and tracking your progress each week.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20 md:px-12">
      <SectionLabel>How it works</SectionLabel>

      <div className="mt-8 mb-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
        {steps.map((step, i) => (
          <ScrollReveal key={step.id} delayMs={i * 120}>
            <div className="group rounded-2xl border-t border-gold/25 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:bg-charcoal-light/60">
              <span className="font-mono text-3xl text-clay transition-colors duration-300 group-hover:text-gold">
                {step.number}
              </span>
              <h3 className="mt-3 font-display text-4xl text-cream transition-colors duration-300 group-hover:text-gold">
                {step.title}
              </h3>
              <p className="mt-2 text-base font-robotoCondensed leading-relaxed text-cream/70">
                {step.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <div className="mb-10 border bg-muted flex flex-col items-start justify-between gap-6 border-gold/15 p-10 md:flex-row md:items-end w-11/12 rounded-xl mx-auto">
              <div>
                <h2 className="font-display text-3xl leading-tight text-textLight md:text-4xl">
                  Eat Smarter,
                  <br />
                  <span className="text-clay">Live Healthier.</span>
                </h2>
              </div>
              <button className="py-4 px-3 bg-clay rounded-3xl text-textLight" >Get My Meal Plan</button>
            </div>
    </section>
  );
}