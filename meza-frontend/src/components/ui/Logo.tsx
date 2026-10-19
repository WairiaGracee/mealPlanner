interface LogoProps {
  className?: string;
}

// A fan of five leaves (the mark) + the wordmark, drawn as one inline SVG so
// it scales with whatever height the caller gives it (h-10 w-auto, etc.) and
// picks up the active theme colours. `brightness-0 invert` on dark
// backgrounds still turns the whole thing white.
const LEAF = "M0 0C7 -7 8 -19 0 -30C-8 -19 -7 -7 0 0Z";

export default function Logo({ className = "h-16 w-auto sm:h-18" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 252 48"
      role="img"
      aria-label="IntentionallyWell"
      className={`flex-shrink-0 ${className}`}
    >
      <g transform="translate(23 45)">
        <path d={LEAF} transform="rotate(-58) scale(0.7)" className="fill-forest" fillOpacity="0.55" />
        <path d={LEAF} transform="rotate(58) scale(0.7)" className="fill-forest" fillOpacity="0.55" />
        <path d={LEAF} transform="rotate(-29) scale(0.92)" className="fill-forest" fillOpacity="0.8" />
        <path d={LEAF} transform="rotate(29) scale(0.92)" className="fill-forest" fillOpacity="0.8" />
        <path d={LEAF} transform="scale(1.08)" className="fill-forest" />
      </g>
      <text
        x="52"
        y="31"
        textLength="196"
        lengthAdjust="spacingAndGlyphs"
        className="fill-ink"
        style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: 25 }}
      >
        IntentionallyWell
      </text>
    </svg>
  );
}