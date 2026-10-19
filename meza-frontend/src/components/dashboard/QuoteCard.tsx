import { IconLeaf } from "./icons";
import { ACCENT } from "./accents";

export default function QuoteCard() {
  return (
    <div
      className="flex h-full flex-col justify-center gap-2 rounded-2xl p-5"
      style={{ backgroundColor: ACCENT.sage.bg, color: ACCENT.sage.ink }}
    >
      <IconLeaf className="h-5 w-5" style={{ color: ACCENT.sage.fg }} />
      <p className="font-display text-base italic leading-snug">
        "Healthy living is not a destination, it's a journey of small, consistent choices."
      </p>
    </div>
  );
}