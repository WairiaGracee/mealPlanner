// interface LogoProps {
//   className?: string;
//   showMark?: boolean;
// }

// // A fan of five leaves (the mark) + the wordmark, drawn as one inline SVG so
// // it scales with whatever height the caller gives it (h-10 w-auto, etc.) and
// // picks up the active theme colours. `brightness-0 invert` on dark
// // backgrounds still turns the whole thing white.
// const LEAF = "M0 0C7 -7 8 -19 0 -30C-8 -19 -7 -7 0 0Z";

export default function Logo() {
  return (
      <text
        x="52"
        y="31"
        lengthAdjust="spacingAndGlyphs"
        className="fill-ink text-[25px] sm:text-[19px]"
      >
        IntentionallyWell
      </text>
  );
}