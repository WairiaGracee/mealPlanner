import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SectionLabel from "../components/ui/SectionLabel";
import Button from "../components/ui/Button";
import ScrollReveal from "../components/ui/ScrollReveal";
import heroImg from "../assets/hero.png";

const values = [
  {
    id: "value-familiar",
    title: "Kenyan food, not substitutes",
    description:
      "No swapping ugali for quinoa. We plan around the dishes people actually grew up eating, and adjust portions and prep instead of the food itself.",
  },
  {
    id: "value-personal",
    title: "Built around you, not a template",
    description:
      "Your goal, household size, diet style, allergies, cooking time and budget all shape the plan — two people never get the identical week.",
  },
  {
    id: "value-practical",
    title: "Grocery lists that match local markets",
    description:
      "Ingredients and quantities are written the way you'd actually shop for them, not converted from a foreign recipe site.",
  },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />

      <section className="relative overflow-hidden px-6 pb-16 pt-8 md:px-12 md:pb-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal>
            <SectionLabel>About us</SectionLabel>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] text-ink md:text-5xl lg:text-6xl">
              Meal planning that actually looks like{" "}
              <span className="italic text-forest">home.</span>
            </h1>
            <p className="mt-6 max-w-lg font-robotoCondensed text-base text-inkMuted md:text-lg">
              We started this because every meal-planning app we tried assumed
              a Western pantry — quinoa, kale, almond milk. Kenyan food was
              treated as something to work around instead of something to
              build a healthy plan on. We build the plan around it instead.
            </p>
            <div className="mt-8">
              <Button variant="primary" onClick={() => navigate("/register")}>
                Get your first plan
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="relative">
              <div
                className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-forest-light"
                aria-hidden="true"
              />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-xl sm:aspect-[5/4] lg:aspect-[4/5]">
                <img
                  src={heroImg}
                  alt="A home-cooked Kenyan meal, plated"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-paper px-6 py-16 md:px-12 md:py-24">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Why we exist</SectionLabel>
            <h2 className="mt-4 font-display text-3xl text-ink md:text-4xl">
              Your food shouldn't be the thing you give up
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-inkMuted md:text-base">
              Whether the goal is weight loss, managing a health condition, or
              just eating with more intention, most advice starts by asking
              you to eat differently from your family. We think the better
              answer is portioning, ingredient swaps, and smarter prep — not
              a whole new cuisine.
            </p>
          </div>
        </ScrollReveal>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {values.map((value, i) => (
            <ScrollReveal key={value.id} delayMs={i * 100}>
              <div className="h-full rounded-2xl border border-line bg-offwhite p-6">
                <h3 className="font-display text-xl text-ink">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-inkMuted">
                  {value.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 md:py-24">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <SectionLabel>Where we're building from</SectionLabel>
            <h2 className="mt-4 font-display text-3xl text-ink md:text-4xl">
              Made in Kenya, for Kenyan kitchens
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-inkMuted md:text-base">
              We're building this from Nyeri, with markets in Nairobi,
              Mombasa and Kisumu shaping what goes into every grocery list.
              As we grow, the plan is the same food culture, more regional
              detail — not a generic template stretched across the country.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}