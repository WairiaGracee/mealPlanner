import type { SVGProps, FC } from "react";

type IconProps = SVGProps<SVGSVGElement>;
export type IconComponent = FC<IconProps>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconHome(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function IconClipboard(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4V3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5V4" />
      <path d="M9 11h6M9 15h6M9 19h3" />
    </svg>
  );
}

export function IconBook(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 4.5c1.6-.7 4-1 7-1s5.4.3 7 1v15c-1.6-.7-4-1-7-1s-5.4.3-7 1z" />
      <path d="M12 3.5v15" />
    </svg>
  );
}

export function IconCart(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6.2" />
      <circle cx="9.5" cy="20" r="1.1" />
      <circle cx="17" cy="20" r="1.1" />
    </svg>
  );
}

export function IconChart(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V10M11 20V4M18 20v-7" />
      <path d="M3 20h18" />
    </svg>
  );
}

export function IconSwap(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8h13l-3-3.5M20 16H7l3 3.5" />
    </svg>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20.3S3.5 15.4 3.5 9.6C3.5 6.5 5.9 4.5 8.5 4.5c1.7 0 3 .8 3.5 2 .5-1.2 1.8-2 3.5-2 2.6 0 5 2 5 5.1 0 5.8-8.5 10.7-8.5 10.7Z" />
    </svg>
  );
}

export function IconSettings(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1a2 2 0 0 1-4 0v-.2a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4a2 2 0 0 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.6V4a2 2 0 0 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.6 1H20a2 2 0 0 1 0 4h-.2a1.7 1.7 0 0 0-1.6 1Z" />
    </svg>
  );
}

export function IconBell(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12.5 9 17l11-11" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.3-4.3" />
    </svg>
  );
}

export function IconGrid(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconTarget(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconBookmark(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4-6.5 4V4.5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

export function IconHistory(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.7-6.2" />
      <path d="M3.5 4.5v4.3h4.3" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17" />
      <path d="M8 3v4M16 3v4" />
    </svg>
  );
}

export function IconDownload(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4v11.5" />
      <path d="M7 11.5 12 16.5 17 11.5" />
      <path d="M4.5 19.5h15" />
    </svg>
  );
}

export function IconHelp(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.5 9.3a2.5 2.5 0 0 1 4.85.8c0 1.7-2.35 1.8-2.35 3.4" />
      <path d="M12 17.3v.1" />
    </svg>
  );
}

export function IconLogout(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 21H5.5a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 5.5 3H9" />
      <path d="M16 16.5 21 12l-5-4.5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconGamepad(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="7.5" width="19" height="10" rx="4" />
      <path d="M7 10.5v4M5 12.5h4" />
      <circle cx="15.5" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="13.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTrophy(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4h10v5a5 5 0 0 1-10 0Z" />
      <path d="M7 5.5H4a2 2 0 0 0 0 4h1.2M17 5.5h3a2 2 0 0 1 0 4h-1.2" />
      <path d="M12 14v3.5" />
      <path d="M8.5 20.5h7" />
      <path d="M9.5 17.5h5v1.5a2 2 0 0 1-.6 1.4l-.1.1H10.2l-.1-.1a2 2 0 0 1-.6-1.4Z" />
    </svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function IconLeaf(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 19c0-8 5-13.5 14-14-1 8.5-6.5 13-14 14Z" />
      <path d="M5 19c2-2.5 4.5-5 9-8" />
    </svg>
  );
}

export function IconActivity(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12h4l2-7 4 14 2-7h6" />
    </svg>
  );
}

export function IconFlame(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21c4 0 6.5-2.6 6.5-6.2 0-2.9-1.8-4.7-2.8-6.6-.7 1.6-1.7 2.3-2.5 1.5.6-2.6-.4-5-3-6.7.4 2.5-.7 4.4-2.3 6.2C6.3 10.9 5.5 12.6 5.5 14.8 5.5 18.4 8 21 12 21Z" />
    </svg>
  );
}

export function IconPieChart(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5V12h8.5A8.5 8.5 0 0 0 12 3.5Z" />
      <path d="M20.1 15A8.5 8.5 0 1 1 9 3.9" />
    </svg>
  );
}

export function IconDroplet(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5S5.5 10.7 5.5 15a6.5 6.5 0 0 0 13 0c0-4.3-6.5-11.5-6.5-11.5Z" />
    </svg>
  );
}

export function IconStopwatch(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 13.5 15 11" />
      <path d="M10 2h4" />
      <path d="M12 2v2.5" />
    </svg>
  );
}