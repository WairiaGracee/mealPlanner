import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { menuTiles, type MenuTile } from "../../data/menuTiles";
import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";

const toneStyles: Record<MenuTile["tone"], string> = {
  gold: "from-gold/30 via-forest-light to-forest-deep",
  clay: "from-clay/35 via-forest-light to-forest-deep",
  sukuma: "from-sukuma/30 via-forest-light to-forest-deep",
};

// Only ever show up to 6 tiles, to match the reference layout's density.
const visibleTiles = menuTiles.slice(0, 6);

function MenuTileButton({ tile, onClick }: { tile: MenuTile; onClick: () => void }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = tile.image && !imageFailed;

  return (
    <button
      onClick={onClick}
      aria-label={`See menu — ${tile.name}`}
      className="group relative block aspect-square w-full overflow-hidden rounded-2xl shadow-sm"
    >
      {showImage ? (
        <img
          src={tile.image}
          alt={tile.name}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${toneStyles[tile.tone]} bg-grain`}
        />
      )}

      {/* Constant dark scrim so the centered label stays legible on any photo,
          with a slightly stronger wash on hover for feedback. */}
      <span className="absolute inset-0 bg-forest-deep/25 transition-colors duration-300 group-hover:bg-forest-deep/45" />

      <span className="absolute inset-0 flex items-center justify-center px-4">
        <span className="font-robotoCondensed text-lg font-bold uppercase tracking-[0.08em] text-white drop-shadow-md md:text-xl">
          {tile.name}
        </span>
      </span>
    </button>
  );
}

export default function SampleMealPlans() {
  const navigate = useNavigate();

  return (
    <section
      id="dishes"
      className="grid grid-cols-1 bg-offwhite text-ink lg:grid-cols-[minmax(0,1fr)_2fr]"
    >
      {/* Text panel */}
      <div className="flex flex-col justify-center px-6 py-16 md:px-12 lg:py-24">
        <span className="font-display text-3xl italic text-clay">
          Mouthwatering
        </span>
        <h2 className="mt-2 font-display text-4xl leading-tight text-ink md:text-5xl">
          Seasonal Kenyan Menus
        </h2>
        <p className="mt-5 max-w-sm text-md leading-relaxed text-inkMuted font-robotoCondensed">
          A rotating sample of what a real week on intentionallyWell looks like — sourced
          from every region, portioned to your goals, and never the same
          dish twice in a week.
        </p>
        <Button
          variant="primary"
          className="mt-8 self-start"
          onClick={() => navigate("/login")}
        >
          See menu
        </Button>
      </div>

      {/* Photo grid — 3 across, 2 rows, with breathing room between tiles */}
      <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-3 md:gap-4 md:p-10 font-robotoCondensed">
        {visibleTiles.map((tile, i) => (
          <ScrollReveal key={tile.id} delayMs={i * 80}>
            <MenuTileButton tile={tile} onClick={() => navigate("/login")} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}