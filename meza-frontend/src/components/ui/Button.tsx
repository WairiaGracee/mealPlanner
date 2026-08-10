import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-forest text-offwhite hover:bg-forest-deep focus-visible:bg-forest-deep",
  outline:
    "border border-forest/40 text-ink hover:border-forest hover:text-forest",
  ghost: "text-ink/70 hover:text-forest",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}