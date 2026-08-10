import ScrollReveal from "../ui/ScrollReveal";

interface Benefit {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

const benefits: Benefit[] = [
  {
    id: "benefit-time",
    title: "Save Real Time",
    description:
      "A full week of dinners planned in minutes, so you're not staring at the fridge wondering what to cook.",
    image:
      "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?auto=format&fit=crop&w=500&h=500&q=80",
    href: "#how-it-works",
  },
  {
    id: "benefit-nutrition",
    title: "Eat More Intentionally",
    description:
      "Balanced, home-style meals built around real ingredients, not guesswork or another forgotten fad diet.",
    image:
      "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=500&h=500&q=80",
    href: "#recipes",
  },
  {
    id: "benefit-budget",
    title: "Shop With Purpose",
    description:
      "A ready shopping list means less food waste, fewer impulse buys, and a grocery run that matches your plan.",
    image:
      "https://images.unsplash.com/photo-1543352632-fea6d4f83e78?auto=format&fit=crop&w=500&h=500&q=80",
    href: "#gather",
  },
  {
    id: "benefit-connection",
    title: "Bring the Table Together",
    description:
      "Familiar dishes made simple, so mealtime feels less like a chore and more like the moment your family looks forward to.",
    image:
      "https://images.unsplash.com/photo-1569420077790-afb136b3bb8c?auto=format&fit=crop&w=500&h=500&q=80",
    href: "#blog",
  },
];

export default function BenefitsSection() {
  return (
    <section
      aria-label="Benefits of healthy meal planning"
      className="bg-offwhite px-6 py-24 md:px-12 md:py-32"
    >
      <ScrollReveal>
        <div className="mx-auto max-w-xl text-center">
          <span className="font-robotoCondensed text-xs uppercase tracking-[0.35em] text-clay">
            Why Plan With Us
          </span>
          <h2 className="mt-4 font-display text-4xl text-forest-deep md:text-5xl">
            The Benefits of Healthy Meal Planning
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-forest-deep/20" />
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ink/60 md:text-base font-robotoCondensed">
            Less stress, less waste, better food — here's what changes once
            your week is actually planned.
          </p>
        </div>
      </ScrollReveal>

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, i) => (
          <ScrollReveal key={benefit.id} delayMs={i * 100}>
            <a href={benefit.href} className="group flex flex-col items-center text-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-full shadow-sm ring-4 ring-forest-deep/10 transition-transform duration-500 ease-out group-hover:scale-[1.04] md:h-36 md:w-36">
                <img
                  src={benefit.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>

              <h3 className="mt-7 font-display text-lg text-forest-deep md:text-xl">
                {benefit.title}
              </h3>

              <p className="mt-3 max-w-[220px] text-md leading-relaxed text-ink/60 font-robotoCondensed">
                {benefit.description}
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 font-robotoCondensed text-[11px] uppercase tracking-[0.2em] text-clay transition-colors duration-300 group-hover:text-forest-deep">
                Read more
                <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                  →
                </span>
              </span>
            </a>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}