import type { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export default function TextField({
  id,
  label,
  className = "",
  ...rest
}: TextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>
      <input
        id={id}
        className={`mt-2 w-full rounded-lg border border-gold/25 bg-charcoal-light px-4 py-3 text-sm text-cream placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${className}`}
        {...rest}
      />
    </div>
  );
}