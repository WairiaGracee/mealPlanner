import type { ReactNode } from "react";
import Logo from "../ui/Logo";
import { heroImages } from "../../data/heroImages";

function PhoneFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative w-[220px] ${className}`}>
      {/* Side buttons — purely decorative, sit outside the bezel */}
      <span className="absolute -left-[3px] top-20 h-8 w-[3px] rounded-l-sm bg-charcoal-light" />
      <span className="absolute -left-[3px] top-32 h-12 w-[3px] rounded-l-sm bg-charcoal-light" />
      <span className="absolute -right-[3px] top-28 h-16 w-[3px] rounded-r-sm bg-charcoal-light" />

      {/* Metallic-edge bezel */}
      <div className="rounded-[2.1rem] bg-gradient-to-br from-charcoal-light via-charcoal-deep to-black p-[5px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)]">
        <div className="relative h-[420px] overflow-hidden rounded-[1.8rem] bg-charcoal-deep">
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
    <div className="relative flex h-full flex-col text-cream">
      <img
        src={heroImages[0]}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-deep/55 to-charcoal-deep/85" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between p-3 pt-9">
          <Logo className="h-4 w-auto" />
          <div className="flex flex-col gap-1">
            <span className="h-px w-4 bg-cream" />
            <span className="h-px w-4 bg-cream" />
          </div>
        </div>

        {/* Centered content fills the remaining space */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <p className="font-mono text-[7px] uppercase tracking-widest text-gold">
            Eat better. Feel better. Live better.
          </p>
          <p className="mt-2 font-display text-3xl leading-[0.95] drop-shadow-md">
            TASTE OF
            <br />
            <span className="italic text-gold">HOME</span>
          </p>
          <div className="mt-5 flex gap-2">
            <span className="rounded-full bg-gold px-3 py-1.5 font-mono text-[8px] font-medium uppercase tracking-wide text-charcoal-deep">
              Get your first plan
            </span>
            <span className="rounded-full border border-cream/50 px-3 py-1.5 font-mono text-[8px] uppercase tracking-wide text-cream">
              See how it works
            </span>
          </div>
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
    <div className="h-full bg-white p-4 pt-9 text-charcoal-deep">
      <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-clay">
        This week
      </p>

      <div className="mt-3 space-y-2">
        {meals.map(([day, meal]) => (
          <div
            key={day}
            className="flex items-center justify-between rounded-lg bg-charcoal-deep/5 px-3 py-2 text-xs"
          >
            <span className="font-mono text-muted">{day}</span>
            <span className="font-medium">{meal}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-charcoal-deep/5 p-3.5">
        <p className="text-[11px] text-charcoal-deep/50">Weekly progress</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-charcoal-deep/10">
            <div className="h-2 w-4/6 rounded-full bg-sukuma" />
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
      {/* Soft glow behind the phones — adds depth so the composition doesn't
          feel flat against the section background */}
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