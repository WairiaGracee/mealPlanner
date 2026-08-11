import type { HydrationGoal, NutritionOverview } from "../../types";
import { IconActivity, IconDroplet, IconFlame } from "./icons";

interface NutritionOverviewCardProps {
  overview: NutritionOverview;
  hydration: HydrationGoal;
}

export default function NutritionOverviewCard({
  overview,
  hydration,
}: NutritionOverviewCardProps) {
  const { avgCalories, targetCalories, macros, activeMinutes } = overview;

  const kcalPerGram: Record<string, number> = { Protein: 4, Carbs: 4, Fat: 9 };
  const kcalParts = macros.map((m) => m.value * (kcalPerGram[m.label] ?? 4));
  const totalKcalParts = kcalParts.reduce((a, b) => a + b, 0) || 1;

  let cursor = 0;
  const stops = macros.map((m, i) => {
    const pct = (kcalParts[i] / totalKcalParts) * 100;
    const start = cursor;
    const end = cursor + pct;
    cursor = end;
    return `${m.colorVar} ${start}% ${end}%`;
  });
  const gradient = `conic-gradient(${stops.join(", ")})`;

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-ink">Nutrition overview</h2>
        <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-inkMuted">
          This week
        </span>
      </div>

      <div className="mt-5 flex items-center gap-5">
        <div
          className="relative flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-full"
          style={{ background: gradient }}
        >
          <div
            className="flex flex-col items-center justify-center rounded-full bg-paper text-center"
            style={{ height: "5.25rem", width: "5.25rem" }}
          >
            <span className="font-display text-xl text-ink">
              {avgCalories.toLocaleString()}
            </span>
            <span className="text-[10px] text-inkMuted">kcal / day</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2.5">
          {macros.map((m) => (
            <div key={m.label} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-ink">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: m.colorVar }}
                />
                {m.label}
              </span>
              <span className="text-inkMuted">
                {m.value}
                {m.unit} / {m.target}
                {m.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 divide-x divide-line border-t border-line pt-4">
        <div className="flex flex-col items-center gap-1 px-2 text-center">
          <IconFlame className="h-4 w-4 text-forest" />
          <span className="text-sm font-medium text-ink">
            {targetCalories.toLocaleString()} kcal
          </span>
          <span className="text-[11px] text-inkMuted">Target</span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 text-center">
          <IconActivity className="h-4 w-4 text-forest" />
          <span className="text-sm font-medium text-ink">{activeMinutes ?? 0} min</span>
          <span className="text-[11px] text-inkMuted">Active</span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 text-center">
          <IconDroplet className="h-4 w-4 text-forest" />
          <span className="text-sm font-medium text-ink">
            {hydration.current} / {hydration.target} cups
          </span>
          <span className="text-[11px] text-inkMuted">Hydration</span>
        </div>
      </div>
    </div>
  );
}