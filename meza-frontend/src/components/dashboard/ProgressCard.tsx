import type { ProgressStat } from "../../types";

interface ProgressCardProps {
  stats: ProgressStat[];
}

export default function ProgressCard({ stats }: ProgressCardProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <h2 className="font-display text-lg text-ink">Your progress</h2>
      <p className="mt-1 text-sm text-inkMuted">This week</p>

      <div className="mt-5 flex flex-1 flex-col gap-4">
        {stats.map((stat) => {
          const pct = Math.min(100, Math.round((stat.value / stat.target) * 100));
          return (
            <div key={stat.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-ink">
                  <span aria-hidden="true">{stat.icon}</span>
                  {stat.label}
                </span>
                <span className="text-inkMuted">
                  {stat.value} / {stat.target}
                  {stat.unit ? ` ${stat.unit}` : ""}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-forest-light">
                <div
                  className="h-full rounded-full bg-forest transition-all duration-500 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button className="mt-5 flex items-center gap-1 text-sm font-medium text-forest hover:text-forest-deep">
        View full progress →
      </button>
    </div>
  );
}