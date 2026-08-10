export default function WavyLine() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-1/3 z-0 h-40 w-full text-forest/20 md:top-1/4"
      viewBox="0 0 1440 240"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0,160 C 220,60 380,220 620,140 S 1040,20 1440,120"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}