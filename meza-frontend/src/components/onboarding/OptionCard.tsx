interface OptionCardProps {
  label: string;
  description?: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}

export default function OptionCard({
  label,
  description,
  icon,
  selected,
  onClick,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-150 ${
        selected
          ? "border-forest bg-forest-light shadow-sm"
          : "border-line bg-paper hover:border-forest/40 hover:bg-forest-light/40"
      }`}
    >
      <span
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base ${
          selected ? "bg-forest text-offwhite" : "bg-offwhite text-forest"
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-medium text-ink">{label}</span>
        {description && (
          <span className="mt-0.5 block text-sm text-inkMuted">
            {description}
          </span>
        )}
      </span>
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[10px] ${
          selected
            ? "border-forest bg-forest text-offwhite"
            : "border-line text-transparent"
        }`}
        aria-hidden="true"
      >
        ✓
      </span>
    </button>
  );
}