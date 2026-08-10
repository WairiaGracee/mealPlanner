import { UserPlus, CalendarCheck, ShoppingBasket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SectionLabel from "../ui/SectionLabel";
import ScrollReveal from "../ui/ScrollReveal";
import Button from "../ui/Button";

const steps = [
  {
    id: "step-1",
    icon: UserPlus,
    title: "Create an account",
    description:
      "Sign up to unlock a personalized nutrition experience tailored to your lifestyle. Your account keeps your meal plans, preferences, and progress in one place.",
  },
  {
    id: "step-2",
    icon: CalendarCheck,
    title: "Get your weekly plan",
    description:
      "Receive a personalized weekly meal plan designed around your health goals, dietary preferences, and lifestyle — Kenyan dishes, tailored just for you.",
  },
  {
    id: "step-3",
    icon: ShoppingBasket,
    title: "Shop, cook, and stay on track",
    description:
      "Use your personalized shopping list to buy exactly what you need and prepare delicious, nutritious meals. Stay consistent, week after week.",
  },
];

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <section id="how-it-works" className="bg-offwhite px-6 py-20 md:px-12">
       <h2 className="mt-4 font-display text-4xl text-forest-deep md:text-5xl text-center">
            How It Works
          </h2>
      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <ScrollReveal key={step.id} delayMs={i * 120}>
              <div className="group h-full rounded-2xl border border-line bg-paper p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest-light text-forest transition-colors duration-300 group-hover:bg-forest group-hover:text-offwhite">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-display text-xl text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-inkMuted font-robotoCondensed">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      <div className="mx-auto mt-16 flex w-11/12 flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-forest-light p-10 md:flex-row md:items-end">
        <div>
          <h2 className="font-display text-3xl leading-tight text-ink md:text-4xl">
            Eat Smarter,
            <br />
            <span className="italic text-clay">Live Healthier.</span>
          </h2>
        </div>
        <Button variant="primary" onClick={() => navigate("/register")}>
          Get My Meal Plan
        </Button>
      </div>
    </section>
  );
}