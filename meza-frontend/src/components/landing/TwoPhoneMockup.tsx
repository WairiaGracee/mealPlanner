import type { ReactNode } from "react";
import Logo from "../ui/Logo";

function PhoneFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative w-[220px] ${className}`}>
      {/* Side buttons — purely decorative, sit outside the bezel.
          Kept dark regardless of theme, since that's just what phone
          hardware looks like. */}
      <span className="absolute -left-[3px] top-20 h-8 w-[3px] rounded-l-sm bg-forest-deep" />
      <span className="absolute -left-[3px] top-32 h-12 w-[3px] rounded-l-sm bg-forest-deep" />
      <span className="absolute -right-[3px] top-28 h-16 w-[3px] rounded-r-sm bg-forest-deep" />

      {/* Metallic-edge bezel */}
      <div className="rounded-[2.1rem] bg-gradient-to-br from-forest-deep via-forest-deep to-black p-[5px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]">
        <div className="relative h-[420px] overflow-hidden rounded-[1.8rem] bg-forest-deep">
          {/* Dynamic-island style notch */}
          <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

          {children}

          {/* Glass reflection over the whole screen */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
          <div className="pointer-events-none absolute -left-10 top-0 z-10 h-full w-16 -skew-x-12 bg-gradient-to-r from-white/5 to-transparent" />
        </div>
      </div>
    </div>
  );
}

function LandingScreen() {
  return (
    <div className="flex h-full flex-col bg-offwhite p-3 pt-9 text-ink">
      <div className="flex items-center justify-between">
        <Logo className="h-4 w-auto" />
        <div className="flex flex-col gap-1">
          <span className="h-px w-4 bg-ink" />
          <span className="h-px w-4 bg-ink" />
        </div>
      </div>

      {/* Mirrors the real hero's copy and light styling */}
      <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
        <p className="font-mono text-[6px] uppercase tracking-widest text-forest">
          Eat better. Feel better. Live better.
        </p>
        <p className="mt-2 font-display text-xl leading-[1.05] text-ink">
          Healthy Kenyan
          <br />
          <span className="italic text-forest">Food, Planned.</span>
        </p>
        <div className="mt-4 flex gap-1.5">
          <span className="rounded-full bg-forest px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-wide text-offwhite">
            Get your first plan
          </span>
          <span className="rounded-full border border-forest/40 px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-wide text-ink">
            See how it works
          </span>
        </div>
      </div>
    </div>
  );
}

function DashboardScreen() {
  const meals: [string, string][] = [
    ["Mon", "Sukuma & Ugali"],
    ["Tue", "Coconut Pilau"],
    ["Wed", "Nyama Choma"],
  ];

  return (
    <div className="h-full bg-white p-4 pt-9 text-ink">
      <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-clay">
        This week
      </p>

      <div className="mt-3 space-y-2">
        {meals.map(([day, meal]) => (
          <div
            key={day}
            className="flex items-center justify-between rounded-lg bg-forest-light px-3 py-2 text-xs"
          >
            <span className="font-mono text-inkMuted">{day}</span>
            <span className="font-medium">{meal}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-forest-light p-3.5">
        <p className="text-[11px] text-inkMuted">Weekly progress</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-ink/10">
            <div className="h-2 w-4/6 rounded-full bg-forest" />
          </div>
          <span className="text-xs font-semibold">71%</span>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <span className="flex-1 rounded-lg bg-gold/25 px-2 py-2.5 text-center text-[10px] font-medium">
          View recipe
        </span>
        <span className="flex-1 rounded-lg bg-clay/20 px-2 py-2.5 text-center text-[10px] font-medium">
          Grocery list
        </span>
      </div>
    </div>
  );
}

export default function TwoPhoneMockup() {
  return (
    <div className="relative mx-auto flex h-[480px] w-full max-w-md items-center justify-center">
      <div
        className="pointer-events-none absolute h-72 w-72 rounded-full bg-gold/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 h-56 w-56 rounded-full bg-clay/20 blur-3xl"
        aria-hidden="true"
      />

      <PhoneFrame className="absolute left-2 top-2 -rotate-6">
        <LandingScreen />
      </PhoneFrame>
      <PhoneFrame className="absolute right-2 bottom-2 rotate-3">
        <DashboardScreen />
      </PhoneFrame>
    </div>
  );
}