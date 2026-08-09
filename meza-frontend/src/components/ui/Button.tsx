import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-gold text-charcoal-deep hover:bg-charcoal-deep hover:text-cream focus-visible:bg-charcoal-deep focus-visible:text-cream",
  outline:
    "border border-gold/60 text-cream hover:border-gold hover:text-gold",
  ghost: "text-cream/80 hover:text-gold",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}