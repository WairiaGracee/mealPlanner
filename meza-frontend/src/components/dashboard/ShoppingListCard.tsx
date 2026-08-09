import type { ShoppingCategory } from "../../types";
import { IconCart } from "./icons";

interface ShoppingListCardProps {
  categories: ShoppingCategory[];
  itemsRemaining: number;
}

export default function ShoppingListCard({ categories, itemsRemaining }: ShoppingListCardProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <IconCart className="h-5 w-5 text-forest" />
        <h2 className="font-display text-lg text-ink">Your shopping list</h2>
      </div>
      <p className="mt-1 text-sm text-inkMuted">
        {itemsRemaining} items remaining — for this week's plan
      </p>

      <button className="mt-4 w-full rounded-full bg-forest py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep">
        View full list
      </button>

      <div className="mt-5 grid flex-1 grid-cols-2 gap-x-4 gap-y-4 text-sm">
        {categories.map((cat) => (
          <div key={cat.name}>
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-inkMuted">
              {cat.name}
            </p>
            <ul className="mt-2 flex flex-col gap-1 text-ink">
              {cat.items.map((item) => (
                <li key={item} className="text-[13px] leading-snug">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button className="mt-5 w-full rounded-full border border-line py-2.5 text-sm font-medium text-ink transition-colors hover:bg-forest-light">
        🛒 Add all items to list
      </button>
    </div>
  );
}