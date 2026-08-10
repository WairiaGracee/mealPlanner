interface SectionLabelProps {
  children: string;
  /** Use "dark" on the few remaining dark forest bands (footer, auth panel) */
  variant?: "light" | "dark";
  className?: string
}

export default function SectionLabel({ children, variant = "light" }: SectionLabelProps) {
  const textColor = variant === "dark" ? "text-gold/90" : "text-forest";

  return (
    <div className="flex items-center gap-3">
      <span className="h-1.5 w-1.5 rotate-45 bg-clay" aria-hidden="true" />
      <span className={`font-mono text-xs tracking-[0.2em] uppercase ${textColor}`}>
        {children}
      </span>
    </div>
  );
}