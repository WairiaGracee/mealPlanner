import type { DishFeature } from "../../types";

interface DishCardProps {
  dish: DishFeature;
  /** Alternates the placeholder tone so the trio doesn't read as identical blocks */
  tone: "gold" | "clay" | "sukuma";
}

const toneStyles: Record<DishCardProps["tone"], string> = {
  gold: "from-gold/25 via-charcoal-light to-charcoal-deep",
  clay: "from-clay/30 via-charcoal-light to-charcoal-deep",
  sukuma: "from-sukuma/25 via-charcoal-light to-charcoal-deep",
};

export default function DishCard({ dish, tone }: DishCardProps) {
  return (
    <figure className="flex flex-col">
      {/* Placeholder visual: swap the inner div for an <img> once photography
          is available. Arch shape echoes the reference layout. */}
      <div
        className={`aspect-[3/4] rounded-t-[9999px] bg-gradient-to-b ${toneStyles[tone]} bg-grain bg-grain`}
        role="img"
        aria-label={`${dish.name} placeholder image`}
      />
      <figcaption className="mt-4 border-t border-gold/15 pt-4">
        <p className="font-display text-xl text-cream">{dish.name}</p>
        <p className="mt-1 font-mono text-xs uppercase tracking-wide text-muted">
          {dish.swahiliNote} · {dish.region}
        </p>
      </figcaption>
    </figure>
  );
}