import WobblyFruit from "./WobblyFruit";
import { IconSun } from "./icons";
import { IconMoon } from "./extraicons";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardGreeting({ userName }: { userName: string }) {
  const Icon = new Date().getHours() >= 17 ? IconMoon : IconSun;
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl text-ink sm:text-3xl">
          {greeting()}, {userName}
          <Icon className="h-6 w-6 text-gold" />
        </h1>
        <p className="mt-1 text-sm text-inkMuted">
          Fuel your body. Nourish your mind. You've got this!
        </p>
      </div>
      <WobblyFruit className="h-16 w-14 flex-shrink-0 xl:hidden" />
    </div>
  );
}