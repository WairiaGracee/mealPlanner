interface SectionLabelProps {
  children: string;
  /** Use "light" on cream/light backgrounds so the label stays readable */
  variant?: "dark" | "light";
}

export default function SectionLabel({ children, variant = "dark" }: SectionLabelProps) {
  const textColor =
    variant === "light"
      ? "text-clay"
      : "text-gold/90";

  return (
    <div className="flex items-center gap-3">
      <span className="h-1.5 w-1.5 rotate-45 bg-clay" aria-hidden="true" />
      <span
        className={`font-mono text-xs tracking-[0.2em] uppercase ${textColor}`}
      >
        {children}
      </span>
    </div>
  );
}