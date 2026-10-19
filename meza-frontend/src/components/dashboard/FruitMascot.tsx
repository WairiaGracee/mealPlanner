import WobblyFruit from "./WobblyFruit";

export default function FruitMascot() {
  return (
    <div className="relative hidden w-36 flex-col items-center justify-center xl:flex">
      <svg
        aria-hidden="true"
        viewBox="0 0 100 60"
        fill="none"
        className="pointer-events-none absolute -left-8 bottom-6 h-16 w-24 text-forest/40"
      >
        <path d="M2 8C30 4 60 20 78 52" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 5" strokeLinecap="round" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="absolute right-2 top-16 h-4 w-4 animate-pulse text-gold" fill="currentColor">
        <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8Z" />
      </svg>
      <p className="mb-1 -rotate-6 text-center font-display text-sm italic leading-snug text-inkMuted">
        Good food fuels
        <br />
        great days!
      </p>
      <WobblyFruit className="h-36 w-32" />
    </div>
  );
}