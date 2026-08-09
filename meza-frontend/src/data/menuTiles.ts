export interface MenuTile {
  id: string;
  name: string;
  tone: "gold" | "clay" | "sukuma";
  /** Optional — falls back to a gradient placeholder if not provided */
  image?: string;
}

export const menuTiles: MenuTile[] = [
  { id: "tile-1", name: "Nyama Choma", tone: "clay", image: "/hero/nyamachoma.jpg" },
  { id: "tile-2", name: "Coconut Pilau", tone: "gold", image: "/hero/coastal-pilau.jpg" },
  { id: "tile-3", name: "Grilled Tilapia", tone: "sukuma", image: "/menu/grilled-tilapia.png" },
  { id: "tile-4", name: "Beef Stew & Chapati", tone: "gold", image: "/menu/beef-stew-chapati.png" },
  { id: "tile-5", name: "Mukimo & Managu", tone: "sukuma", image: "/menu/mokimo-managu.png" },
  { id: "tile-6", name: "Sukuma & Ugali", tone: "clay", image: "/hero/sukumawiki-ugali.png" },
];