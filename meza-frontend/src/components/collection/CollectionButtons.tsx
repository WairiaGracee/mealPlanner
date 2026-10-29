import { useState } from "react";
import { IconBookmark, IconHeart } from "../dashboard/icons";
import { toggleCollection, type CollectionKind } from "../../lib/mealplans";

interface Props {
  recipeId: string;
  isFavourite: boolean;
  isSaved: boolean;
}

export default function CollectionButtons({ recipeId, isFavourite, isSaved }: Props) {
  const [active, setActive] = useState<Record<CollectionKind, boolean>>({
    favourite: isFavourite,
    saved: isSaved,
  });
  const [busy, setBusy] = useState<CollectionKind | null>(null);

  async function flip(kind: CollectionKind) {
    if (busy) return;
    setBusy(kind);
    setActive((p) => ({ ...p, [kind]: !p[kind] })); // optimistic
    try {
      const res = await toggleCollection(recipeId, kind);
      setActive((p) => ({ ...p, [kind]: res.active }));
    } catch {
      setActive((p) => ({ ...p, [kind]: !p[kind] })); // undo
    } finally {
      setBusy(null);
    }
  }

  const style = (on: boolean) =>
    `flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
      on
        ? "border-clay bg-paper text-clay"
        : "border-line bg-paper text-ink hover:bg-forest-light"
    }`;

  return (
    <>
      <button
        onClick={() => flip("favourite")}
        aria-pressed={active.favourite}
        className={style(active.favourite)}
      >
        <IconHeart className="h-4 w-4" fill={active.favourite ? "currentColor" : "none"} />
        {active.favourite ? "Favorited" : "Favorite"}
      </button>
      <button
        onClick={() => flip("saved")}
        aria-pressed={active.saved}
        className={style(active.saved)}
      >
        <IconBookmark className="h-4 w-4" fill={active.saved ? "currentColor" : "none"} />
        {active.saved ? "Saved" : "Save"}
      </button>
    </>
  );
}