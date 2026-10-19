import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconTarget, IconCheck } from "./icons";
import { ACCENT } from "./accents";

const GOALS = ["Eat balanced meals", "Stay hydrated", "Be active", "Feel your best"];

export default function GoalsCard() {
  const navigate = useNavigate();
  const [done, setDone] = useState<boolean[]>(GOALS.map(() => false));

  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: ACCENT.sage.bg, color: ACCENT.sage.fg }}
        >
          <IconTarget className="h-[18px] w-[18px]" />
        </span>
        <h2 className="font-display text-lg text-ink">Your Goals</h2>
      </div>
      <p className="mt-2 text-sm text-inkMuted">Small steps, big results.</p>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {GOALS.map((goal, i) => (
          <button
            key={goal}
            onClick={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
            className="flex items-center gap-3 text-left"
          >
            <span
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                done[i] ? "border-forest bg-forest text-offwhite" : "border-line text-transparent"
              }`}
            >
              <IconCheck className="h-3 w-3" strokeWidth={2.6} />
            </span>
            <span className={`text-sm italic ${done[i] ? "text-inkMuted line-through" : "text-ink"}`}>{goal}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate("/onboarding")}
        className="mt-5 w-full rounded-full bg-forest-light py-2 text-sm font-medium text-forest-deep transition-colors hover:bg-forest/20"
      >
        Update goals
      </button>
    </div>
  );
}