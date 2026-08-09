interface AvatarProps {
  name: string;
  className?: string;
}

const PALETTE = [
  { bg: "bg-gold", text: "text-charcoal-deep" },
  { bg: "bg-clay", text: "text-cream" },
  { bg: "bg-sukuma", text: "text-charcoal-deep" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function paletteFor(name: string) {
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return PALETTE[sum % PALETTE.length];
}

export default function Avatar({ name, className = "h-12 w-12" }: AvatarProps) {
  const { bg, text } = paletteFor(name);

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-full font-display text-sm ${bg} ${text} ${className}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}