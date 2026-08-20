import { forwardRef } from "react";
import Logo from "../ui/Logo";
import { IconCheck } from "../dashboard/icons";
import type { GroceryListItem } from "../../lib/mealplans";

const CATEGORY_LABELS: Record<string, string> = {
  proteins: "Proteins",
  vegetables: "Vegetables",
  carbs_staples: "Carbohydrates & Staples",
  fruits: "Fruits",
  dairy: "Dairy",
  other: "Other",
};

interface GroceryListExportCardProps {
  items: GroceryListItem[];
  weekRange: string;
}

const GroceryListExportCard = forwardRef<HTMLDivElement, GroceryListExportCardProps>(
  function GroceryListExportCard({ items, weekRange }, ref) {
    const grouped = items.reduce<Record<string, GroceryListItem[]>>((acc, item) => {
      (acc[item.category] ??= []).push(item);
      return acc;
    }, {});
    const checkedCount = items.filter((i) => i.is_checked).length;

    return (
      <div className="fixed left-0 top-0 h-0 w-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
      <div ref={ref} className="w-[640px] bg-offwhite">
        <div className="flex flex-col gap-6 p-10">
          <div className="flex items-center justify-between border-b border-line pb-6">
            <Logo className="h-10 w-auto" />
            <div className="text-right">
              <p className="font-display text-2xl text-ink">Grocery List</p>
              <p className="text-sm text-inkMuted">{weekRange}</p>
            </div>
          </div>

          <p className="text-sm text-inkMuted">
            {checkedCount}/{items.length} items already checked off
          </p>

          <div className="flex flex-col gap-4">
            {Object.entries(grouped).map(([category, categoryItems]) => (
              <div key={category} className="rounded-2xl border border-line bg-paper p-5">
                <h3 className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-inkMuted">
                  {CATEGORY_LABELS[category] ?? category}
                </h3>
                <div className="mt-3 flex flex-col gap-2">
                  {categoryItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <span
                        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${
                          item.is_checked
                            ? "border-forest bg-forest text-offwhite"
                            : "border-line bg-paper"
                        }`}
                      >
                        {item.is_checked && (
                          <IconCheck className="h-2.5 w-2.5" strokeWidth={2.5} />
                        )}
                      </span>
                      <span
                        className={`text-sm ${
                          item.is_checked ? "text-inkMuted line-through" : "text-ink"
                        }`}
                      >
                        {item.name}
                        {item.quantity ? ` — ${item.quantity}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-forest-light/50 px-5 py-3 text-center text-xs text-inkMuted">
            Made with Meza — Kenyan meal planning, personalized to you.
          </div>
        </div>
      </div>
      </div>
    );
  }
);

export default GroceryListExportCard;