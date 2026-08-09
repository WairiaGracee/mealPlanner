import type { DayPlan } from "../../types";

interface WeekGlanceCardProps {
  week: DayPlan[];
}

export default function WeekGlanceCard({ week }: WeekGlanceCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <h2 className="font-display text-xl text-ink">Your week at a glance</h2>

      <div className="mt-5 flex flex-col gap-1">
        {week.map((day) => (
          <div
            key={day.day}
            className={`flex items-start gap-4 rounded-xl px-3 py-3 ${
              day.isToday ? "bg-forest-light" : ""
            }`}
          >
            <span className="w-9 flex-shrink-0 text-sm font-medium text-ink">{day.day}</span>
            <div className="flex-1 text-sm text-inkMuted">
              {day.meals.join(" · ")}
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 flex items-center gap-1 text-sm font-medium text-forest hover:text-forest-deep">
        View full weekly plan →
      </button>
    </div>
  );
}