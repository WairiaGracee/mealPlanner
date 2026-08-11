import type { HydrationGoal } from "../../types";

interface HydrationCardProps {
  hydration: HydrationGoal;
}

export default function HydrationCard({ hydration }: HydrationCardProps) {
  const { current, target } = hydration;
  const pct = Math.min(100, Math.round((current / target) * 100));

  return (
    <div className="rounded-2xl bg-forest-light p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="text-base">💧</span>
        <h2 className="font-display text-base text-ink">Hydration goal</h2>
      </div>

      <p className="mt-3 font-display text-2xl text-ink">
        {current} <span className="font-sans text-sm font-normal text-inkMuted">/ {target} glasses</span>
      </p>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-paper/70">
        <div
          className="h-full rounded-full bg-forest transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-4 flex gap-1.5">
        {Array.from({ length: target }).map((_, i) => (
          <span
            key={i}
            className={`flex h-7 flex-1 items-center justify-center rounded-md text-xs ${
              i < current ? "bg-forest text-offwhite" : "bg-paper text-inkMuted"
            }`}
            aria-hidden="true"
          >
            🥤
          </span>
        ))}
      </div>
    </div>
  );
}