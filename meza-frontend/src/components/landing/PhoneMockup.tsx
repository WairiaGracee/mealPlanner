import type { ReactNode } from "react";
import type { ShowcaseTabId } from "../../types";

interface PhoneMockupProps {
  activeTab: ShowcaseTabId;
}

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-charcoal-deep">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        {/* signal */}
        <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor" aria-hidden="true">
          <rect x="0" y="6" width="2.5" height="4" rx="0.5" />
          <rect x="4" y="4" width="2.5" height="6" rx="0.5" />
          <rect x="8" y="2" width="2.5" height="8" rx="0.5" />
          <rect x="12" y="0" width="2.5" height="10" rx="0.5" opacity="0.4" />
        </svg>
        {/* wifi */}
        <svg width="14" height="10" viewBox="0 0 16 12" fill="none" aria-hidden="true">
          <path d="M1 4.5C4.5 1 11.5 1 15 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M3.5 7C5.7 4.8 10.3 4.8 12.5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="8" cy="10" r="1.2" fill="currentColor" />
        </svg>
        {/* battery */}
        <svg width="22" height="11" viewBox="0 0 24 12" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="19" height="11" rx="2.5" stroke="currentColor" />
          <rect x="2" y="2" width="16" height="8" rx="1.2" fill="currentColor" />
          <rect x="21" y="4" width="2" height="4" rx="1" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[270px] rounded-[2.75rem] bg-charcoal-deep p-[10px] shadow-[0_35px_60px_-20px_rgba(0,0,0,0.5)]">
      <div className="relative min-h-[500px] overflow-hidden rounded-[2.1rem] bg-white">
        {/* Dynamic-island notch */}
        <div className="absolute left-1/2 top-2.5 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-charcoal-deep" />

        <StatusBar />

        <div className="px-4 pb-6 pt-4">{children}</div>
      </div>
    </div>
  );
}

export default function PhoneMockup({ activeTab }: PhoneMockupProps) {
  return (
    <PhoneFrame>
      {activeTab === "plan" && <PlanContent />}
      {activeTab === "recipe" && <RecipeContent />}
      {activeTab === "shop" && <ShopContent />}
      {activeTab === "remind" && <RemindContent />}
    </PhoneFrame>
  );
}

function PlanContent() {
  const days: [string, string][] = [
    ["Mon", "Sukuma & Ugali"],
    ["Tue", "Coconut Pilau"],
    ["Wed", "Nyama Choma"],
    ["Thu", "Githeri Bowl"],
    ["Fri", "Mukimo & Greens"],
  ];

  return (
    <div className="space-y-2">
      <p className="font-mono text-[11px] uppercase tracking-wide text-clay">
        This week
      </p>
      {days.map(([day, meal]) => (
        <div
          key={day}
          className="flex items-center justify-between rounded-lg bg-charcoal/5 px-3 py-2.5 text-xs text-charcoal-deep shadow-sm"
        >
          <span className="font-mono text-muted">{day}</span>
          <span className="font-medium">{meal}</span>
        </div>
      ))}
    </div>
  );
}

function RecipeContent() {
  const ingredients = ["Basmati rice", "Coconut milk", "Beef cubes", "Pilau masala"];

  return (
    <div className="space-y-3">
      <div className="h-32 overflow-hidden rounded-xl">
        <img
          src="https://images.unsplash.com/photo-1634324092526-91f5e878b72f?auto=format&fit=crop&w=500&h=360&q=80"
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <p className="font-display text-lg text-charcoal-deep">
        Coastal Coconut Pilau
      </p>
      <p className="text-xs text-charcoal-deep/60">
        6 ingredients · 35 min · 520 kcal
      </p>
      <div className="space-y-1.5">
        {ingredients.map((ing) => (
          <div key={ing} className="flex items-center gap-2 text-xs text-charcoal-deep/80">
            <span className="h-1.5 w-1.5 rounded-full bg-sukuma" />
            {ing}
          </div>
        ))}
      </div>
    </div>
  );
}

function ShopContent() {
  const groups: [string, string[]][] = [
    ["Vegetables", ["Sukuma wiki", "Tomatoes", "Onions"]],
    ["Proteins", ["Beef", "Eggs"]],
  ];

  return (
    <div className="space-y-4">
      <p className="font-mono text-[11px] uppercase tracking-wide text-clay">
        Grocery list
      </p>
      {groups.map(([group, items]) => (
        <div key={group}>
          <p className="mb-1 text-[11px] font-medium text-charcoal-deep/50">
            {group}
          </p>
          {items.map((item) => (
            <label
              key={item}
              className="mb-1 flex items-center gap-2 text-xs text-charcoal-deep"
            >
              <span className="h-3.5 w-3.5 rounded border border-charcoal-deep/30" />
              {item}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

function RemindContent() {
  return (
    <div className="space-y-3">
      <p className="font-mono text-[11px] uppercase tracking-wide text-clay">
        Today
      </p>
      <div className="rounded-xl bg-charcoal/5 p-3 shadow-sm">
        <p className="text-[11px] text-charcoal-deep/50">6:30 PM · Google Calendar</p>
        <p className="mt-1 text-sm font-medium text-charcoal-deep">
          Start dinner: Nyama Choma
        </p>
      </div>
      <div className="rounded-xl bg-charcoal/5 p-3 opacity-60 shadow-sm">
        <p className="text-[11px] text-charcoal-deep/50">Tomorrow · 12:00 PM</p>
        <p className="mt-1 text-sm font-medium text-charcoal-deep">
          Prep lunch: Githeri Bowl
        </p>
      </div>
    </div>
  );
}