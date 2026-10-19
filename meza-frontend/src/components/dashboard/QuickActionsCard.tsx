import { useNavigate } from "react-router-dom";
import { IconCalendar, IconChart, IconCart, IconUser } from "./icons";
import { IconBolt } from "./extraicons";
import { ACCENT } from "./accents";

const ACTIONS = [
  { label: "Plan meals", Icon: IconCalendar, path: "/plan", accent: ACCENT.peach },
  { label: "Progress", Icon: IconChart, path: "/nutrition", accent: ACCENT.sage },
  { label: "Add to list", Icon: IconCart, path: "/shopping-list", accent: ACCENT.lavender },
  { label: "Profile", Icon: IconUser, path: "/onboarding", accent: ACCENT.sky },
];

export default function QuickActionsCard() {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl border border-line bg-paper p-5">
      <h2 className="flex items-center gap-2 font-display text-lg text-ink">
        <IconBolt className="h-4 w-4 text-gold" />
        Quick actions
      </h2>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {ACTIONS.map(({ label, Icon, path, accent }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-line px-1 py-3 text-center text-[11px] font-medium leading-tight text-ink transition-colors hover:bg-forest-light/40"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ backgroundColor: accent.bg, color: accent.fg }}
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}