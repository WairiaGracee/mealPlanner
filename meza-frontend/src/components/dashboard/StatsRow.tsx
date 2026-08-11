import type { StatCard } from "../../types";
import {
  IconActivity,
  IconCalendar,
  IconCart,
  IconFlame,
  type IconComponent,
} from "./icons";

interface StatsRowProps {
  stats: StatCard[];
}

interface CardTheme {
  bg: string;
  fg: string;
  value: string;
  track: string;
  bar: string;
}

// Pastel palette cycled across the cards, matching the tracker-card look.
const THEMES: CardTheme[] = [
  { bg: "#E3E1F7", fg: "#65628C", value: "#221F3A", track: "#CFCCEA", bar: "#65628C" },
  { bg: "#E1E9E6", fg: "#6C7A75", value: "#1F2A26", track: "#CDDAD5", bar: "#6C7A75" },
  { bg: "#F2DCE1", fg: "#8D6470", value: "#33202A", track: "#E4C3CC", bar: "#8D6470" },
  { bg: "#F3E1D2", fg: "#8D6E52", value: "#332619", track: "#E7CCB3", bar: "#8D6E52" },
  { bg: "#E6E9C9", fg: "#7C8354", value: "#292B12", track: "#D6DBA9", bar: "#7C8354" },
];

// Rotate through a small icon set as a sensible default per card position.
const ICONS: IconComponent[] = [IconActivity, IconCalendar, IconCart, IconFlame];

export default function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const theme = THEMES[i % THEMES.length];
        const Icon = ICONS[i % ICONS.length];

        return (
          <div
            key={stat.label}
            className="flex flex-col gap-3 rounded-2xl p-4 sm:p-5"
            style={{ backgroundColor: theme.bg }}
          >
            <div className="flex items-center gap-2 font-robotoCondensed">
              <Icon className="h-6 w-6 flex-shrink-0" style={{ color: theme.fg }} />
              <p className="text-sm font-medium sm:text-md" style={{ color: theme.fg }}>
                {stat.label}
              </p>
            </div>

            <p className="font-robotoCondensed text-3xl font-semibold leading-none sm:text-4xl" style={{ color: theme.value }}>
              {stat.value}
              <span className="ml-1 font-robotoCondensed text-sm font-normal" style={{ color: theme.fg }}>
                {stat.sub}
              </span>
            </p>

            {typeof stat.progressPct === "number" && (
              <div
                className="h-1.5 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: theme.track }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${stat.progressPct}%`, backgroundColor: theme.bar }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}