import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import Modal from "../ui/Modal";
import Logo from "../ui/Logo";
import Avatar from "../ui/Avatar";
import {
  IconGrid,
  IconClipboard,
  IconBook,
  IconCart,
  IconTarget,
  IconHeart,
  IconBookmark,
  IconHistory,
  IconGamepad,
  IconTrophy,
  IconCalendar,
  IconDownload,
  IconSettings,
  IconHelp,
  IconLogout,
  IconPlus,
  IconBell,
  IconSearch,
  IconChevronDown,
} from "./icons";

interface DashboardLayoutProps {
  userName: string;
  children: ReactNode;
}

interface NavItem {
  label: string;
  icon: typeof IconGrid;
  path?: string;
  action?: "google-calendar" | "export-plan" | "logout";
}

interface NavSection {
  label: string;
  defaultOpen?: boolean;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Menu",
    defaultOpen: true,
    items: [
      { label: "Dashboard", icon: IconGrid, path: "/dashboard" },
      { label: "Meal Planner", icon: IconClipboard, path: "/plan" },
      { label: "Recipes", icon: IconBook, path: "/recipes" },
      { label: "Grocery List", icon: IconCart, path: "/shopping-list" },
      { label: "Nutrition", icon: IconTarget, path: "/nutrition" },
    ],
  },
  {
    label: "My Collection",
    items: [
      { label: "Favorites", icon: IconHeart, path: "/favourites" },
      { label: "Saved Meals", icon: IconBookmark, path: "/saved-meals" },
      { label: "Meal History", icon: IconHistory, path: "/meal-history" },
    ],
  },
  {
    label: "Food Games",
    items: [
      { label: "Recipe Quiz", icon: IconGamepad, path: "/games/recipe-quiz" },
      { label: "Cooking Challenges", icon: IconTrophy, path: "/games/cooking-challenges" },
      { label: "Pantry Match", icon: IconGamepad, path: "/games/pantry-match" },
      { label: "Build Your Plate", icon: IconTarget, path: "/games/build-your-plate" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Add to Google Calendar", icon: IconCalendar, action: "google-calendar" },
      { label: "Export Plan", icon: IconDownload, action: "export-plan" },
    ],
  },
];

const ACCOUNT_SECTION: NavSection = {
  label: "Account",
  items: [
    { label: "Settings", icon: IconSettings, path: "/settings" },
    { label: "Help & Support", icon: IconHelp, path: "/help" },
    { label: "Log Out", icon: IconLogout, action: "logout" },
  ],
};

export default function DashboardLayout({ userName, children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NAV_SECTIONS.map((s) => [s.label, Boolean(s.defaultOpen)]))
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  function toggleSection(label: string) {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  function handleLogout() {
    setLogoutError(null);
    setShowLogoutConfirm(true);
  }

  function cancelLogout() {
    setShowLogoutConfirm(false);
  }

  async function confirmLogout() {
    setLoggingOut(true);
    setLogoutError(null);
    try {
      await logout();
      navigate("/");
    } catch {
      setLogoutError("Couldn't log out — check your connection and try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  function handleItemClick(item: NavItem) {
    if (item.action === "logout") {
      handleLogout();
      return;
    }
    if (item.path) {
      navigate(item.path);
      return;
    }
    if (item.action === "google-calendar") {
      // Connect/sync UI lives on the Settings page, since it needs to
      // show connection status and handle the redirect back from Google.
      navigate("/settings");
      return;
    }
    if (item.action === "export-plan") {
      // The actual Export button (image/PDF) lives on the Meal Planner
      // page next to the week it applies to.
      navigate("/plan");
      return;
    }
    // TODO: wire up real plan export once the backend supports it.
  }

  function renderSection(section: NavSection) {
    const isOpen = Boolean(openSections[section.label]);
    return (
      <div key={section.label} className="pb-1">
        <button
          onClick={() => toggleSection(section.label)}
          aria-expanded={isOpen}
          className="flex w-full items-center font-robotoCondensed justify-between rounded-lg px-3 py-2 text-left transition-colors hover:bg-forest-light"
        >
          <span className="font-robotoCondensed text-[12px] font-medium uppercase tracking-[0.12em] text-inkMuted">
            {section.label}
          </span>
          <IconChevronDown
            className={`h-3.5 w-3.5 flex-shrink-0 text-inkMuted transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="mt-1 flex flex-col gap-1 font-robotoCondensed">
            {section.items.map((item) => {
              const active = item.path === "/dashboard";
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? "bg-forest text-offwhite"
                      : "text-ink/80 hover:bg-forest-light"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  function renderPlainSection(section: NavSection) {
    return (
      <div key={section.label} className="pb-1">
        <p className="px-3 py-2 font-robotoCondensed text-[11px] font-medium uppercase tracking-[0.12em] text-inkMuted">
          {section.label}
        </p>
        <div className="flex flex-col gap-1 font-robotoCondensed">
          {section.items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => handleItemClick(item)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-ink/80 transition-colors hover:bg-forest-light"
              >
                <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-offwhite bg-fruit-pattern bg-repeat lg:flex lg:h-screen lg:overflow-hidden lg:gap-2 lg:p-2">
      <aside className="hidden w-72 flex-shrink-0 flex-col rounded-r-2xl border-r border-line bg-paper py-7 shadow-[4px_0_16px_-4px_rgba(0,0,0,0.08)] lg:flex lg:h-screen">
        <button onClick={() => navigate("/")} className="px-7 text-left">
          <Logo className="h-10 w-auto" />
        </button>

        <button
          onClick={() => navigate("/plan")}
          className="mx-5 mt-6 flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
        >
          <IconPlus className="h-4 w-4" strokeWidth={2} />
          Plan a Meal
        </button>

        <nav className="scroll-on-hover mt-7 flex-1 overflow-y-auto px-5 pb-2">
          <div className="flex flex-col gap-1">
            {NAV_SECTIONS.map(renderSection)}
            {renderPlainSection(ACCOUNT_SECTION)}
          </div>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col lg:h-screen lg:overflow-hidden">
        <header className="flex flex-shrink-0 items-center justify-between border-b border-line bg-paper px-6 py-4 lg:hidden">
          <Logo className="h-9 w-auto" />
          <div className="flex items-center gap-4">
            <IconBell className="h-5 w-5 text-inkMuted" />
            <Avatar name={userName} className="h-9 w-9 text-xs" />
          </div>
        </header>

        <header className="hidden flex-shrink-0 items-center justify-between gap-5 px-8 py-6 lg:flex">
          <label className="flex w-full max-w-md items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 text-inkMuted transition-colors focus-within:border-forest">
            <IconSearch className="h-4 w-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search recipes, meals, or ingredients…"
              className="w-full bg-transparent text-sm text-ink placeholder:text-inkMuted focus:outline-none"
            />
          </label>

          <div className="flex flex-shrink-0 items-center gap-5">
            <IconBell className="h-5 w-5 text-inkMuted" />
            <div className="flex items-center gap-2">
              <Avatar name={userName} className="h-9 w-9 text-xs" />
              <span className="text-sm font-medium text-ink">{userName}</span>
            </div>
          </div>
        </header>

        <main className="scroll-on-hover flex-1 px-4 pb-24 sm:px-6 lg:overflow-y-auto lg:px-8 lg:pb-12">
          {children}
        </main>
      </div>

      <Modal open={showLogoutConfirm} onClose={cancelLogout}>
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <IconLogout className="h-5 w-5" />
          </span>
          <h2 className="mt-4 font-display text-lg text-ink">Log out of Meza?</h2>
          <p className="mt-1 text-sm text-inkMuted">
            You'll need to sign back in to see your meal plans and grocery list.
          </p>
          {logoutError && <p className="mt-3 text-xs text-red-600">{logoutError}</p>}
          <div className="mt-6 flex w-full gap-3">
            <button
              onClick={cancelLogout}
              disabled={loggingOut}
              className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:bg-forest-light disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={confirmLogout}
              disabled={loggingOut}
              className="flex-1 rounded-full bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-60"
            >
              {loggingOut ? "Logging out…" : "Log out"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}