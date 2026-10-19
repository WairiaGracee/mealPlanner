import { useNavigate } from "react-router-dom";
import { IconCart, IconChevronRight } from "./icons";
import { ACCENT } from "./accents";

export default function ShoppingListStrip({ count }: { count: number }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/shopping-list")}
      className="flex w-full items-center gap-4 rounded-2xl border border-line bg-paper p-5 text-left transition-colors hover:bg-forest-light/40"
    >
      <span
        className="flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: ACCENT.sage.bg, color: ACCENT.sage.fg }}
      >
        <IconCart className="h-6 w-6" />
      </span>
      <div className="flex-1">
        <p className="font-display text-lg text-ink">Shopping list</p>
        <p className="text-sm text-inkMuted">{count} ingredients for your planned meals.</p>
      </div>
      <IconChevronRight className="h-4 w-4 text-inkMuted" />
    </button>
  );
}