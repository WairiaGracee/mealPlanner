import type { WeeklyNutrition, WhoCheck } from "../../lib/mealplans";

const STATUS_STYLE: Record<WhoCheck["status"], { dot: string; text: string }> = {
  ok: { dot: "bg-forest", text: "text-forest" },
  over: { dot: "bg-clay", text: "text-clay" },
  under: { dot: "bg-clay", text: "text-clay" },
  no_data: { dot: "bg-line", text: "text-inkMuted" },
};

function targetText(c: WhoCheck): string {
  const f = (n: number) => Math.round(n).toLocaleString();
  if (c.min != null && c.max != null) return `${f(c.min)}–${f(c.max)} ${c.unit}`;
  if (c.min != null) return `≥ ${f(c.min)} ${c.unit}`;
  if (c.max != null) return `≤ ${f(c.max)} ${c.unit}`;
  return "";
}

export default function WhoWeeklyCard({ data }: { data: WeeklyNutrition | undefined }) {
  if (!data || data.checks.every((c) => c.status === "no_data")) {
    return (
      <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
        <h2 className="font-display text-lg text-ink">WHO weekly check</h2>
        <p className="mt-2 text-sm text-inkMuted">
          This plan was generated before WHO tracking was added. Regenerate your plan to see how
          it measures up.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-ink">WHO weekly check</h2>
        <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-inkMuted">
          Daily average
        </span>
      </div>
      <p className="mt-1 text-xs text-inkMuted">
        Your plan compared with WHO healthy-diet recommendations for adults, based on a{" "}
        {data.calorie_goal.toLocaleString()} kcal day.
      </p>

      <div className="mt-4 flex flex-col divide-y divide-line">
        {data.checks.map((c) => {
          const s = STATUS_STYLE[c.status];
          return (
            <div key={c.key} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <span className="flex items-center gap-2 text-ink">
                <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${s.dot}`} />
                {c.label}
              </span>
              <span className="text-right">
                <span className="font-medium text-ink">
                  {c.weekly_avg != null ? Math.round(c.weekly_avg).toLocaleString() : "—"}
                  <span className="ml-0.5 text-[11px] font-normal text-inkMuted">{c.unit}</span>
                </span>
                <span className="block text-[11px] text-inkMuted">
                  target {targetText(c)} ·{" "}
                  <span className={s.text}>
                    {c.days_ok}/{c.days_total} days
                  </span>
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-inkMuted">
        Nutrient values are estimates and not medical advice. Free sugars, salt and fibre are
        approximations from the recipe ingredients.
      </p>
    </div>
  );
}