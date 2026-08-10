import SectionLabel from "../ui/SectionLabel";

function StatusBar({ dark = false }: { dark?: boolean }) {
  const color = dark ? "text-white" : "text-charcoal-deep";
  return (
    <div className={`flex items-center justify-between px-5 pt-4 text-[10px] font-semibold ${color}`}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="13" height="9" viewBox="0 0 14 10" fill="currentColor" aria-hidden="true">
          <rect x="0" y="6" width="2.5" height="4" rx="0.5" />
          <rect x="4" y="4" width="2.5" height="6" rx="0.5" />
          <rect x="8" y="2" width="2.5" height="8" rx="0.5" />
          <rect x="12" y="0" width="2.5" height="10" rx="0.5" opacity="0.4" />
        </svg>
        <svg width="13" height="9" viewBox="0 0 16 12" fill="none" aria-hidden="true">
          <path d="M1 4.5C4.5 1 11.5 1 15 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M3.5 7C5.7 4.8 10.3 4.8 12.5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="8" cy="10" r="1.2" fill="currentColor" />
        </svg>
        <svg width="20" height="10" viewBox="0 0 24 12" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="19" height="11" rx="2.5" stroke="currentColor" />
          <rect x="2" y="2" width="16" height="8" rx="1.2" fill="currentColor" />
          <rect x="21" y="4" width="2" height="4" rx="1" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

function PhoneShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-[220px] flex-shrink-0 rounded-[2.1rem] bg-gradient-to-br from-neutral-700 via-charcoal-deep to-black p-[3px] shadow-[0_30px_55px_-18px_rgba(0,0,0,0.45)] ${className}`}
    >
      <div className="relative h-[440px] overflow-hidden rounded-[1.9rem] bg-white ring-1 ring-black/40">
        {/* Dynamic island */}
        <div className="absolute left-1/2 top-2 z-30 h-5 w-16 -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  );
}

function BuildPlanPhone() {
  const dishes = [
    {
      name: "Sukuma & Ugali",
      img: "https://images.unsplash.com/photo-1569420077790-afb136b3bb8c?auto=format&fit=crop&w=200&h=200&q=80",
    },
    {
      name: "Coconut Pilau",
      img: "https://images.unsplash.com/photo-1634324092526-91f5e878b72f?auto=format&fit=crop&w=200&h=200&q=80",
    },
  ];

  return (
    <>
      <StatusBar />
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-base text-charcoal-deep/70">✕</span>
          <span className="text-base text-charcoal-deep/70">⌕</span>
        </div>
        <p className="mt-3 font-display text-lg text-charcoal-deep">Build a meal plan</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-charcoal-deep">Most Popular</span>
          <span className="text-[10px] text-forest">See All</span>
        </div>
        <div className="mt-2 flex gap-2">
          {dishes.map((d) => (
            <div key={d.name} className="w-[45%]">
              <div className="relative h-16 overflow-hidden rounded-lg">
                <img src={d.img} alt="" className="h-full w-full object-cover" />
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-forest text-[8px] text-white">
                  ✓
                </span>
              </div>
              <p className="mt-1 text-[9px] leading-tight text-charcoal-deep font-robotoCondensed">{d.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-charcoal-deep">Recently Created</span>
          <span className="text-[10px] text-forest">See All</span>
        </div>
        <div className="mt-2 flex gap-2">
          {["Nyama Choma", "Githeri Bowl"].map((name) => (
            <div key={name} className="w-[45%]">
              <div className="h-16 rounded-lg bg-clay/20" />
              <p className="mt-1 text-[9px] leading-tight text-charcoal-deep font-robotoCondensed">{name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-white px-4 py-3">
        <div className="flex -space-x-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-6 w-6 rounded-full border-2 border-white bg-forest-light" />
          ))}
        </div>
        <span className="rounded-full bg-forest px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-white">
          Build plan
        </span>
      </div>
    </>
  );
}

function GroceriesPhone() {
  const groups: [string, [string, string][]][] = [
    ["Produce", [["Lime", "½"], ["Mango", "1"], ["Garlic", "6 cloves"]]],
    ["Dairy & Eggs", [["Almond milk", "8 fl oz"]]],
    ["Baking & Spices", [["Black pepper", ""], ["Cardamom, ground", ""]]],
  ];

  return (
    <>
      <StatusBar />
      <div className="px-4 pt-3">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-forest px-3 py-1 text-[9px] font-semibold uppercase tracking-wide text-white">
            Shop online
          </span>
          <span className="text-base text-charcoal-deep/60">⋯</span>
        </div>
        <p className="mt-3 font-display text-lg text-charcoal-deep">Groceries</p>

        <div className="mt-3 space-y-3">
          {groups.map(([group, items]) => (
            <div key={group}>
              <p className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-charcoal-deep/40 font-robotoCondensed">
                {group}
              </p>
              {items.map(([item, qty]) => (
                <div key={item} className="flex items-center justify-between py-0.5">
                  <label className="flex items-center gap-2 text-[11px] text-charcoal-deep font-robotoCondensed">
                    <span className="h-3 w-3 rounded-full border border-charcoal-deep/30" />
                    {item}
                  </label>
                  {qty && <span className="text-[10px] text-charcoal-deep/40">{qty}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <span className="absolute bottom-16 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-forest text-base text-white shadow-md">
        +
      </span>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-charcoal-deep/5 bg-white py-2">
        {["Plan", "Groceries", "Favorites", "Settings"].map((label) => (
          <span
            key={label}
            className={`text-[8px] ${label === "Groceries" ? "font-semibold text-forest" : "text-charcoal-deep/40"}`}
          >
            {label}
          </span>
        ))}
      </div>
    </>
  );
}

function RecipePhone() {
  return (
    <>
      <StatusBar dark />
      <div className="relative h-40 w-full">
        <img
          src="https://images.unsplash.com/photo-1626323109252-0adb3b46692b?auto=format&fit=crop&w=440&h=320&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <span className="absolute right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-xs text-clay">
          ♥
        </span>
      </div>

      <div className="px-4 pt-3">
        <p className="font-display text-base leading-snug text-charcoal-deep">
          Nyama Choma with Kachumbari
        </p>
        <p className="mt-1 text-[10px] text-charcoal-deep/50">30 minutes · 4 servings</p>

        <div className="mt-3 flex gap-3 border-b border-charcoal-deep/10 pb-2 text-[10px] font-semibold uppercase tracking-wide">
          <span className="text-forest font-robotoCondensed">Ingredients</span>
          <span className="text-charcoal-deep/40 font-robotoCondensed">Instructions</span>
        </div>

        <div className="mt-2 space-y-1.5">
          {["Beef ribs", "Red onion", "Tomato", "Lime"].map((item) => (
            <div key={item} className="flex items-center gap-2 text-[11px] font-robotoCondensed text-charcoal-deep/80">
              <span className="h-1.5 w-1.5 rounded-full bg-sukuma" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-white px-4 py-3">
        <span className="text-[10px] font-medium text-charcoal-deep/70">4 servings ⌄</span>
        <span className="rounded-full bg-forest px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-white">
          Add to plan
        </span>
      </div>
    </>
  );
}

export default function ThreePhoneShowcase() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-offwhite to-offwhite px-6 py-20 md:px-12 md:py-28">
      <div
        className="pointer-events-none absolute -left-20 top-10 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <h2 className="mt-6 font-display text-5xl leading-[0.95] tracking-tight text-ink md:text-7xl">
            Your busy weeknights are about to be so much easier.
          </h2>
          <p className="mt-10 max-w-md font-robotoCondensed text-sm font-semibold uppercase leading-relaxed tracking-wide text-ink/70 md:text-base">
            We've made meal planning, grocery shopping, and cooking as simple
            as getting takeout.
          </p>
          <button className="mt-10 rounded-full bg-forest px-8 py-4 font-robotoCondensed text-sm uppercase tracking-wide text-offwhite shadow-lg transition-colors hover:bg-forest-deep">
            Start saving time
          </button>
        </div>

        <div className="relative -mx-6 flex items-center overflow-hidden px-6 md:mx-0 md:overflow-visible md:px-0">
          <PhoneShell className="-mr-14 -translate-x-4 opacity-90 md:-mr-16">
            <BuildPlanPhone />
          </PhoneShell>
          <PhoneShell className="-mr-14 translate-y-4 md:-mr-16">
            <GroceriesPhone />
          </PhoneShell>
          <PhoneShell className="z-10 translate-y-8 shadow-[0_40px_70px_-15px_rgba(0,0,0,0.5)]">
            <RecipePhone />
          </PhoneShell>
        </div>
      </div>
    </section>
  );
}