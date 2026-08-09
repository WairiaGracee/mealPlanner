import type { ShowcaseTabId } from "../../types";

interface PhoneMockupProps {
  activeTab: ShowcaseTabId;
}

export default function PhoneMockup({ activeTab }: PhoneMockupProps) {
  return (
    <div className="mx-auto w-full max-w-[280px] rounded-[2.5rem] border-8 border-charcoal-deep bg-charcoal-deep p-2 shadow-2xl">
      <div className="relative min-h-[440px] overflow-hidden rounded-[1.75rem] bg-white">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-charcoal-deep" />

        <div className="px-4 pb-6 pt-9">
          {activeTab === "plan" && <PlanContent />}
          {activeTab === "recipe" && <RecipeContent />}
          {activeTab === "shop" && <ShopContent />}
          {activeTab === "remind" && <RemindContent />}
        </div>
      </div>
    </div>
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
          className="flex items-center justify-between rounded-lg bg-charcoal/5 px-3 py-2 text-xs text-charcoal-deep shadow-sm"
        >
          <span className="font-mono text-muted">{day}</span>
          <span>{meal}</span>
        </div>
      ))}
    </div>
  );
}

function RecipeContent() {
  const ingredients = ["Basmati rice", "Coconut milk", "Beef cubes", "Pilau masala"];

  return (
    <div className="space-y-3">
      <div className="h-28 rounded-xl bg-gradient-to-br from-clay/40 via-charcoal-light to-charcoal-deep" />
      <p className="font-display text-lg text-charcoal-deep">
        Coastal Coconut Pilau
      </p>
      <p className="text-xs text-charcoal-deep/60">6 ingredients · 35 min · 520 kcal</p>
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