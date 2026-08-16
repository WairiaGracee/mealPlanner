interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

export default function ProgressBar({ step, totalSteps }: ProgressBarProps) {
  const pct = Math.round((step / totalSteps) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between font-robotoCondensed text-xs uppercase tracking-[0.15em] text-inkMuted">
        <span>
          Step {step} of {totalSteps}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-forest-light font-robotoCondensed">
        <div
          className="h-full rounded-full bg-forest transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}