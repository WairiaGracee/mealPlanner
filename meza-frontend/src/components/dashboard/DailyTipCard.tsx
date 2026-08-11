import { IconLeaf } from "./icons";

interface DailyTipCardProps {
  tip: string;
}

export default function DailyTipCard({ tip }: DailyTipCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-forest p-5 sm:p-6">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-forest-deep text-offwhite">
        <IconLeaf className="h-5 w-5" />
      </span>
      <div>
        <p className="font-display text-base text-offwhite">Daily tip</p>
        <p className="mt-1 text-sm text-offwhite/75">{tip}</p>
      </div>
    </div>
  );
}