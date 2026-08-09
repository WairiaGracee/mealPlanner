import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";
import Avatar from "../ui/Avatar";
import {
  IconHome,
  IconClipboard,
  IconBook,
  IconCart,
  IconChart,
  IconSwap,
  IconHeart,
  IconSettings,
  IconBell,
} from "./icons";

interface DashboardLayoutProps {
  userName: string;
  children: ReactNode;
}

const NAV_ITEMS = [
  { label: "Dashboard", icon: IconHome, path: "/dashboard" },
  { label: "My Plan", icon: IconClipboard, path: "/plan" },
  { label: "Recipes", icon: IconBook, path: "/recipes" },
  { label: "Shopping List", icon: IconCart, path: "/shopping-list" },
  { label: "Progress", icon: IconChart, path: "/progress" },
  { label: "Meal Swaps", icon: IconSwap, path: "/meal-swaps" },
  { label: "Favourites", icon: IconHeart, path: "/favourites" },
  { label: "Settings", icon: IconSettings, path: "/settings" },
];

export default function DashboardLayout({ userName, children }: DashboardLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-offwhite lg:flex">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-line bg-paper px-5 py-8 lg:flex">
        <button onClick={() => navigate("/")} className="px-2">
          <Logo className="h-10 w-auto" />
        </button>

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
            const active = path === "/dashboard";
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  active
                    ? "bg-forest text-offwhite"
                    : "text-ink/80 hover:bg-forest-light"
                }`}
              >
                <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-paper px-6 py-4 lg:hidden">
          <Logo className="h-9 w-auto" />
          <div className="flex items-center gap-4">
            <IconBell className="h-5 w-5 text-inkMuted" />
            <Avatar name={userName} className="h-9 w-9 text-xs" />
          </div>
        </header>

        <header className="hidden items-center justify-end gap-5 px-8 py-6 lg:flex">
          <IconBell className="h-5 w-5 text-inkMuted" />
          <div className="flex items-center gap-2">
            <Avatar name={userName} className="h-9 w-9 text-xs" />
            <span className="text-sm font-medium text-ink">{userName}</span>
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 sm:px-6 lg:px-8 lg:pb-12">{children}</main>
      </div>
    </div>
  );
}