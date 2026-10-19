export default function Flourish({ name }: { name: string }) {
  return (
    <div className="relative flex h-20 items-end justify-end overflow-hidden">
      <svg
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-gold/35"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M0 100V70C80 90 140 40 220 55C300 70 340 20 400 30V100Z" />
      </svg>
      <p className="relative mb-3 mr-8 -rotate-2 font-display text-lg italic text-ink/80">
        You got this, {name}!
      </p>
    </div>
  );
}