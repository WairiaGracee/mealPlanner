interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  className?: string;
}

const PALETTE = [
  { bg: "bg-gold", text: "text-ink" },
  { bg: "bg-clay", text: "text-offwhite" },
  { bg: "bg-forest", text: "text-offwhite" },
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

export default function Avatar({ name, imageUrl, className = "h-12 w-12" }: AvatarProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`flex-shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

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