import type { InputHTMLAttributes, ReactNode } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  /** Optional element (e.g. a show/hide password button) rendered inside the field, right-aligned */
  endAdornment?: ReactNode;
  /** Optional helper or error text shown below the field */
  hint?: string;
  hintTone?: "muted" | "error";
}

export default function TextField({
  id,
  label,
  className = "",
  endAdornment,
  hint,
  hintTone = "muted",
  ...rest
}: TextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`mt-2 w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-inkMuted focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest ${
            endAdornment ? "pr-11" : ""
          } ${className}`}
          {...rest}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3">
            {endAdornment}
          </div>
        )}
      </div>
      {hint && (
        <p className={`mt-1.5 text-xs ${hintTone === "error" ? "text-clay" : "text-inkMuted"}`}>
          {hint}
        </p>
      )}
    </div>
  );
}