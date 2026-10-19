import { useId } from "react";
import { IconLeaf, IconStopwatch } from "./icons";
import { IconForkSpoon } from "./extraicons";

interface NutritionHeroCardProps {
  kcal: number;
  target: number;
  protein: number;
  carbs: number;
  fat: number;
}

const R = 52;
const C = 2 * Math.PI * R;

export default function NutritionHeroCard({ kcal, target, protein, carbs, fat }: NutritionHeroCardProps) {
  const gid = useId();
  const pct = Math.min(1, kcal / target);
  const ratio = kcal / target;
  const status = kcal === 0 ? null : ratio < 0.85 ? "Below target" : ratio > 1.1 ? "Over target" : "On track";

  const parts = { carbs: carbs * 4, protein: protein * 4, fat: fat * 9 };
  const total = parts.carbs + parts.protein + parts.fat;
  const share = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0);

  const rows = [
    { label: "Carbs", kcal: parts.carbs, pct: share(parts.carbs), color: "#A8D26D" },
    { label: "Protein", kcal: parts.protein, pct: share(parts.protein), color: "#F2B84B" },
    { label: "Fat", kcal: parts.fat, pct: share(parts.fat), color: "#5FA8D3" },
  ];

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl bg-forest-deep p-5 text-offwhite sm:p-6">
      <IconLeaf className="pointer-events-none absolute -bottom-4 -right-3 h-28 w-28 rotate-12 text-offwhite/5" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-offwhite/10">
            <IconForkSpoon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-lg leading-tight">Today's nutrition</h2>
            <p className="text-xs text-offwhite/60">Stay on track with your goals</p>
          </div>
        </div>
        {status && (
          <span className="flex items-center gap-1.5 rounded-full bg-offwhite/10 px-3 py-1 text-xs font-medium">
            <IconStopwatch className="h-3.5 w-3.5" />
            {status}
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
        <div className="relative h-36 w-36 flex-shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A8D26D" />
                <stop offset="100%" stopColor="#F2C14E" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r={R} fill="none" strokeWidth="10" className="stroke-offwhite/15" />
            <circle
              cx="60"
              cy="60"
              r={R}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              stroke={`url(#${gid})`}
              strokeDasharray={`${C * pct} ${C}`}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-3xl">{kcal.toLocaleString()}</span>
            <span className="text-xs text-offwhite/60">kcal</span>
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col gap-3">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                  {r.label}
                </span>
                <span>
                  <span className="font-semibold">{r.pct}%</span>
                  <span className="ml-2 text-offwhite/60">{Math.round(r.kcal)} kcal</span>
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-offwhite/15">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${r.pct}%`, backgroundColor: r.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-auto pt-4 text-xs text-offwhite/60">Daily target: {target.toLocaleString()} kcal</p>
    </div>
  );
}