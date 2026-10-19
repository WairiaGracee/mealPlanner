import { IconSun, IconLeaf } from "./icons";
import { IconMoon, IconForkSpoon } from "./extraicons";
import { ACCENT } from "./accents";

const SLOT = {
  breakfast: { Icon: IconSun, accent: ACCENT.peach },
  lunch: { Icon: IconSun, accent: ACCENT.sage },
  dinner: { Icon: IconMoon, accent: ACCENT.lavender },
  snack: { Icon: IconLeaf, accent: ACCENT.rose },
} as const;

interface MealSlotIconProps {
  slot: string;
  className?: string;
}

export default function MealSlotIcon({ slot, className = "h-14 w-14" }: MealSlotIconProps) {
  const { Icon, accent } =
    SLOT[slot.toLowerCase() as keyof typeof SLOT] ?? { Icon: IconForkSpoon, accent: ACCENT.sage };
  return (
    <span
      aria-hidden="true"
      style={{
        backgroundColor: accent.bg,
        color: accent.fg,
        boxShadow: `0 0 0 5px ${accent.bg}66`,
      }}
      className={`flex flex-shrink-0 items-center justify-center rounded-full ${className}`}
    >
      <Icon className="h-7 w-7" />
    </span>
  );
}