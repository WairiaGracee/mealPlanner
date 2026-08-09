import { useState } from "react";
import type { ChecklistItem } from "../../types";
import { IconCheck } from "./icons";

interface ChecklistCardProps {
  items: ChecklistItem[];
}

export default function ChecklistCard({ items: initialItems }: ChecklistCardProps) {
  const [items, setItems] = useState(initialItems);

  function toggle(index: number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, done: !item.done } : item))
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <h2 className="font-display text-lg text-ink">Today's checklist</h2>

      <div className="mt-5 flex flex-1 flex-col gap-3">
        {items.map((item, i) => (
          <button
            key={item.label}
            onClick={() => toggle(i)}
            className="flex items-center gap-3 text-left"
          >
            <span
              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-colors ${
                item.done
                  ? "border-forest bg-forest text-offwhite"
                  : "border-line text-transparent"
              }`}
            >
              <IconCheck className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
            <span
              className={`text-sm ${
                item.done ? "text-inkMuted line-through" : "text-ink"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <button className="mt-5 flex items-center gap-1 text-sm font-medium text-forest hover:text-forest-deep">
        View all tasks →
      </button>
    </div>
  );
}