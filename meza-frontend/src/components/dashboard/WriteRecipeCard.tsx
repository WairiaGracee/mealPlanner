import { useNavigate } from "react-router-dom";
import { IconPencil } from "./icons";
import { ACCENT } from "./accents";

export default function WriteRecipeCard() {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-1 flex-col justify-between gap-3 rounded-2xl p-5"
      style={{ backgroundColor: ACCENT.peach.bg, color: ACCENT.peach.ink }}
    >
      <div>
        <div className="flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70"
            style={{ color: ACCENT.peach.fg }}
          >
            <IconPencil className="h-[18px] w-[18px]" />
          </span>
          <h2 className="font-display text-lg">Write a recipe</h2>
        </div>
        <p className="mt-2 text-sm opacity-80">Got a family favourite? Add it to your collection.</p>
      </div>
      {/* TODO: point at the recipe editor once it exists */}
      <button
        onClick={() => navigate("/recipes")}
        className="self-start rounded-full bg-forest px-4 py-2 text-xs font-medium text-offwhite transition-colors hover:bg-forest-deep"
      >
        Start writing
      </button>
    </div>
  );
}