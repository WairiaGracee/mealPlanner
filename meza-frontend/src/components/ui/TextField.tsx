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
        className={`mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-inkMuted focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest ${className}`}
        {...rest}
      />
    </div>
  );
}