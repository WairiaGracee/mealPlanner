import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { menuTiles, type MenuTile } from "../../data/menuTiles";
import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";

const toneStyles: Record<MenuTile["tone"], string> = {
  gold: "from-gold/30 via-charcoal-light to-charcoal-deep",
  clay: "from-clay/35 via-charcoal-light to-charcoal-deep",
  sukuma: "from-sukuma/30 via-charcoal-light to-charcoal-deep",
};

function MenuTileButton({ tile, onClick }: { tile: MenuTile; onClick: () => void }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = tile.image && !imageFailed;

  return (
    <button
      onClick={onClick}
      aria-label={`See menu — ${tile.name}`}
      className="group relative block aspect-square w-full overflow-hidden"
    >
      {showImage ? (
        <img
          src={tile.image}
          alt={tile.name}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${toneStyles[tile.tone]} bg-grain bg-grain`}
        />
      )}

      <span className="absolute inset-0 bg-charcoal-deep/0 transition-colors duration-300 group-hover:bg-charcoal-deep/40" />
      <span className="absolute bottom-3 left-3 font-display text-lg text-cream drop-shadow md:text-xl">
        {tile.name}
      </span>
      <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="rounded-full bg-gold px-5 py-2 font-mono text-xs uppercase tracking-wide text-charcoal-deep">
          See menu
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
      className="grid grid-cols-1 bg-cream text-charcoal-deep lg:grid-cols-[minmax(0,1fr)_2fr]"
    >
      {/* Text panel */}
      <div className="flex flex-col justify-center px-6 py-16 md:px-12 lg:py-24">
        <span className="font-display text-3xl italic text-clay">
          Mouthwatering
        </span>
        <h2 className="mt-2 font-display text-4xl leading-tight text-charcoal-deep md:text-5xl">
          Seasonal Kenyan Menus
        </h2>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-charcoal-deep/70">
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

      {/* Photo mosaic — every tile leads to login, same as the CTA above */}
      <div className="grid grid-cols-2 sm:grid-cols-3">
        {menuTiles.map((tile, i) => (
          <ScrollReveal key={tile.id} delayMs={i * 80}>
            <MenuTileButton tile={tile} onClick={() => navigate("/login")} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}