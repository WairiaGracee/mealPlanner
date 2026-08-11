import type { StatCard } from "../../types";

interface StatsRowProps {
  stats: StatCard[];
}

export default function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-3 rounded-2xl border border-line bg-paper p-4 sm:p-5"
        >
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium text-inkMuted sm:text-sm">{stat.label}</p>
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-forest-light text-base">
              {stat.icon}
            </span>
          </div>

          <p className="font-display text-2xl text-ink sm:text-3xl">
            {stat.value}
            <span className="ml-1 font-sans text-xs font-normal text-inkMuted sm:text-sm">
              {stat.sub}
            </span>
          </p>

          {typeof stat.progressPct === "number" && (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-forest-light">
              <div
                className="h-full rounded-full bg-forest transition-all duration-500 ease-out"
                style={{ width: `${stat.progressPct}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}