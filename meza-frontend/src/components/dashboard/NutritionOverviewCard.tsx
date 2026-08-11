import type { NutritionOverview } from "../../types";

interface NutritionOverviewCardProps {
  overview: NutritionOverview;
}

export default function NutritionOverviewCard({ overview }: NutritionOverviewCardProps) {
  const { avgCalories, targetCalories, macros } = overview;

  // Build conic-gradient stops proportional to each macro's kcal contribution.
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

      <div className="mt-5 flex items-center justify-center">
        <div
          className="relative flex h-40 w-40 items-center justify-center rounded-full"
          style={{ background: gradient }}
        >
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-paper text-center">
            <span className="font-display text-2xl text-ink">
              {avgCalories.toLocaleString()}
            </span>
            <span className="text-[11px] text-inkMuted">kcal / day</span>
          </div>
        </div>
      </div>
      <p className="mt-1 text-center text-xs text-inkMuted">
        Target {targetCalories.toLocaleString()} kcal
      </p>

      <div className="mt-5 flex flex-col gap-3">
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
  );
}