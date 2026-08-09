import ScrollReveal from "../ui/ScrollReveal";

interface Stat {
  id: string;
  value: string;
  label: string;
  bg: string;
  valueColor: string;
  labelColor: string;
}

// Illustrative figures for now — swap in real numbers once we have
// user research or usage data to back them up.
const stats: Stat[] = [
  {
    id: "stat-1",
    value: "40%",
    label: "Less time spent planning meals each week",
    bg: "bg-charcoal-deep",
    valueColor: "text-gold",
    labelColor: "text-cream/70",
  },
  {
    id: "stat-2",
    value: "120+",
    label: "Kenyan dishes in rotation, from every region",
    bg: "bg-gold",
    valueColor: "text-charcoal-deep",
    labelColor: "text-charcoal-deep/70",
  },
  {
    id: "stat-3",
    value: "68%",
    label: "Stick with their weekly plan a full month",
    bg: "bg-clay",
    valueColor: "text-cream",
    labelColor: "text-cream/80",
  },
  {
    id: "stat-4",
    value: "92%",
    label: "Said their meals finally felt like home",
    bg: "bg-sukuma",
    valueColor: "text-charcoal-deep",
    labelColor: "text-charcoal-deep/70",
  },
];

export default function ImpactStats() {
  return (
    <section aria-label="Impact numbers" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <ScrollReveal key={stat.id} delayMs={i * 100}>
          <div className={`flex h-full flex-col justify-between gap-6 p-8 md:p-10 ${stat.bg}`}>
            <span className={`font-display text-5xl md:text-6xl ${stat.valueColor}`}>
              {stat.value}
            </span>
            <p className={`text-sm leading-relaxed ${stat.labelColor}`}>
              {stat.label}
            </p>
          </div>
        </ScrollReveal>
      ))}
    </section>
  );
}