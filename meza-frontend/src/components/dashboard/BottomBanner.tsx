import { useNavigate } from "react-router-dom";

export default function BottomBanner() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl bg-forest p-6 sm:p-8 md:grid-cols-[2fr_1fr] md:items-center">
      <div>
        <p className="font-display text-xl text-offwhite sm:text-2xl">
          Your plan. Your culture. Your health.
        </p>
        <p className="mt-1 text-sm text-offwhite/70">
          Delicious Kenyan meals, personalized for you. Let's nourish your body, intentionally.
        </p>
      </div>

      <div className="rounded-xl bg-forest-deep p-4">
        <p className="text-sm font-medium text-offwhite">Need a change?</p>
        <p className="mt-1 text-xs text-offwhite/70">
          Update your preferences or swap meals anytime.
        </p>
        <button
          onClick={() => navigate("/onboarding")}
          className="mt-3 rounded-full bg-offwhite px-4 py-2 text-xs font-medium text-forest-deep transition-colors hover:bg-forest-light"
        >
          Update preferences
        </button>
      </div>
    </div>
  );
}