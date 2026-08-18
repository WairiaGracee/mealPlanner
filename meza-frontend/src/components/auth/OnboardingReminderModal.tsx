import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import Modal from "../ui/Modal";
import { IconLeaf } from "../dashboard/icons";

const DISMISS_KEY = "meza-onboarding-reminder-dismissed";

// Routes where nudging toward onboarding makes sense — the logged-in
// dashboard area itself, not the public/landing pages, auth pages, the
// onboarding flow itself, or the plan-generation loading screen.
const NUDGE_PATH_PREFIXES = [
  "/dashboard",
  "/plan",
  "/recipes",
  "/shopping-list",
  "/nutrition",
  "/games",
  "/settings",
];

export default function OnboardingReminderModal() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // sessionStorage rather than component state alone: each dashboard
  // page mounts its own <DashboardLayout>, but this component lives
  // once at the App level, so a dismissal here should stick for the
  // rest of the browser session instead of just until the next
  // navigation.
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISS_KEY) === "1"
  );

  const onDashboardArea = NUDGE_PATH_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );
  const shouldShow =
    !loading && !!user && !user.onboarding_completed && onDashboardArea && !dismissed;

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  function goToOnboarding() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
    navigate("/onboarding");
  }

  return (
    <Modal open={shouldShow} onClose={dismiss}>
      <div className="flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest/10 text-forest">
          <IconLeaf className="h-5 w-5" />
        </span>
        <h2 className="mt-4 font-display text-lg text-ink">Finish setting up your plan</h2>
        <p className="mt-2 text-sm text-inkMuted">
          You haven't gone through onboarding yet, so what you're seeing here isn't personalized
          to your goals, diet, or budget. It only takes a couple of minutes and makes every
          recommendation far more useful.
        </p>
        <div className="mt-6 flex w-full gap-3">
          <button
            onClick={dismiss}
            className="flex-1 rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink/80 transition-colors hover:bg-forest-light"
          >
            Maybe later
          </button>
          <button
            onClick={goToOnboarding}
            className="flex-1 rounded-full bg-forest px-4 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
          >
            Go to onboarding
          </button>
        </div>
      </div>
    </Modal>
  );
}