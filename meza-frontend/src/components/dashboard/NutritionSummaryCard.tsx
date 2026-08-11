import type { NutritionOverview } from "../../types";

interface NutritionSummaryCardProps {
  overview: NutritionOverview;
}

export default function NutritionSummaryCard({ overview }: NutritionSummaryCardProps) {
  const cells = [
    { label: "Avg. Calories", value: `${overview.avgCalories.toLocaleString()}`, unit: "kcal", icon: "🔥" },
    ...overview.macros.map((m) => ({
      label: m.label,
      value: `${m.value}`,
      unit: m.unit,
      icon: m.label === "Protein" ? "🥚" : m.label === "Carbs" ? "🌾" : "🥑",
    })),
  ];

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-ink">Nutrition summary</h2>
        <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-inkMuted">
          This week
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {cells.map((cell) => (
          <div key={cell.label} className="rounded-xl border border-line p-3 text-center">
            <span className="text-lg" aria-hidden="true">
              {cell.icon}
            </span>
            <p className="mt-1 font-display text-lg text-ink">
              {cell.value}
              <span className="ml-0.5 font-sans text-[11px] font-normal text-inkMuted">
                {cell.unit}
              </span>
            </p>
            <p className="text-[11px] text-inkMuted">{cell.label}</p>
          </div>
        ))}
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-medium text-forest hover:text-forest-deep">
        Detailed report →
      </button>
    </div>
  );
}