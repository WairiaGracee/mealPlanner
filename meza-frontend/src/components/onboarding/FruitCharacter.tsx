import { useId } from "react";

interface FaceProps {
  cx: number;
  cy: number;
}

function Face({ cx, cy }: FaceProps) {
  const ink = "#2B2318";
  return (
    <g>
      <path d={`M ${cx - 26} ${cy} q 9 -12 18 0`} stroke={ink} strokeWidth={4.5} strokeLinecap="round" fill="none" />
      <path d={`M ${cx + 8} ${cy} q 9 -12 18 0`} stroke={ink} strokeWidth={4.5} strokeLinecap="round" fill="none" />
      <circle cx={cx - 34} cy={cy + 16} r={7} fill="#F4A896" opacity={0.55} />
      <circle cx={cx + 34} cy={cy + 16} r={7} fill="#F4A896" opacity={0.55} />
      <path d={`M ${cx - 16} ${cy + 14} q 16 19 32 0`} stroke={ink} strokeWidth={4.5} strokeLinecap="round" fill="none" />
    </g>
  );
}

interface ArmsProps {
  cx: number;
  cy: number;
  spread: number;
  color: string;
}

function Arms({ cx, cy, spread, color }: ArmsProps) {
  return (
    <g stroke={color} strokeWidth={9} strokeLinecap="round" fill="none">
      <path d={`M ${cx - spread} ${cy} q -20 -16 -30 -44`} />
      <circle cx={cx - spread - 30} cy={cy - 44} r={9} fill={color} />
      <path d={`M ${cx + spread} ${cy} q 20 -16 30 -44`} />
      <circle cx={cx + spread + 30} cy={cy - 44} r={9} fill={color} />
    </g>
  );
}

/** Shared grounding shadow + soft glossy highlight for a 3D-sticker feel. */
function Shadow() {
  return <ellipse cx={110} cy={240} rx={62} ry={12} fill="#2B2318" opacity={0.1} />;
}

function Gloss({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#FFFFFF" opacity={0.35} />;
}

function Avocado() {
  const uid = useId();
  const g = `avo-${uid}`;
  return (
    <svg viewBox="0 0 220 260" className="h-full w-full">
      <defs>
        <radialGradient id={g} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#8CAE6C" />
          <stop offset="100%" stopColor="#527A3E" />
        </radialGradient>
      </defs>
      <Shadow />
      <Arms cx={110} cy={148} spread={52} color="#3D5A40" />
      <path
        d="M110 34 C168 34 188 102 180 160 C172 218 142 236 110 236 C78 236 48 218 40 160 C32 102 52 34 110 34 Z"
        fill={`url(#${g})`}
      />
      <path
        d="M110 54 C152 54 168 108 162 154 C156 202 134 220 110 220 C86 220 64 202 58 154 C52 108 68 54 110 54 Z"
        fill="#EFE1B0"
      />
      <circle cx={110} cy={150} r={32} fill="#8B5A34" />
      <Gloss cx={78} cy={78} rx={26} ry={16} />
      <Face cx={110} cy={140} />
    </svg>
  );
}

function Mango() {
  const uid = useId();
  const g = `mango-${uid}`;
  return (
    <svg viewBox="0 0 220 260" className="h-full w-full">
      <defs>
        <radialGradient id={g} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#FFC15C" />
          <stop offset="100%" stopColor="#E88A2E" />
        </radialGradient>
      </defs>
      <Shadow />
      <Arms cx={112} cy={155} spread={54} color="#D97B3F" />
      <path
        d="M112 36 C176 50 194 122 178 174 C162 226 134 238 108 234 C72 230 42 198 42 154 C42 98 70 32 112 36 Z"
        fill={`url(#${g})`}
      />
      <path
        d="M112 36 C154 48 180 92 176 132 C154 100 130 78 98 66 C86 56 96 40 112 36 Z"
        fill="#E14A3A"
        opacity={0.5}
      />
      <path d="M108 34 q11 -18 24 -15" stroke="#5A7A3C" strokeWidth={7} strokeLinecap="round" fill="none" />
      <Gloss cx={80} cy={80} rx={24} ry={15} />
      <Face cx={108} cy={148} />
    </svg>
  );
}

function Banana() {
  const uid = useId();
  const g = `banana-${uid}`;
  return (
    <svg viewBox="0 0 220 260" className="h-full w-full">
      <defs>
        <radialGradient id={g} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFE58A" />
          <stop offset="100%" stopColor="#EFC13E" />
        </radialGradient>
      </defs>
      <Shadow />
      <Arms cx={112} cy={160} spread={58} color="#E8C13C" />
      <path
        d="M54 216 C30 172 34 104 80 62 C112 32 156 26 176 34 C186 52 176 70 156 76 C120 90 96 118 92 158 C88 194 98 218 120 230 C102 240 74 234 54 216 Z"
        fill={`url(#${g})`}
      />
      <path
        d="M164 32 C178 28 190 36 192 48 C194 60 184 68 172 66 C178 54 174 42 164 32 Z"
        fill="#8B6A2E"
      />
      <Gloss cx={88} cy={92} rx={22} ry={30} />
      <Face cx={106} cy={152} />
    </svg>
  );
}

function Pineapple() {
  const uid = useId();
  const g = `pine-${uid}`;
  return (
    <svg viewBox="0 0 220 260" className="h-full w-full">
      <defs>
        <radialGradient id={g} cx="35%" cy="25%" r="85%">
          <stop offset="0%" stopColor="#F3CB5F" />
          <stop offset="100%" stopColor="#D99C2C" />
        </radialGradient>
      </defs>
      <Shadow />
      <Arms cx={110} cy={168} spread={50} color="#D9A93C" />
      <path d="M110 22 L86 76 L134 76 Z" fill="#4E7A3C" />
      <path d="M84 28 L72 78 L104 72 Z" fill="#5C8C46" />
      <path d="M136 28 L148 78 L116 72 Z" fill="#5C8C46" />
      <path
        d="M58 130 C58 92 82 68 110 68 C138 68 162 92 162 130 L162 176 C162 214 138 238 110 238 C82 238 58 214 58 176 Z"
        fill={`url(#${g})`}
      />
      <g stroke="#B87F1F" strokeWidth={3.5} opacity={0.6}>
        <path d="M64 108 L156 140 M64 140 L156 172 M64 172 L156 204 M68 200 L150 222" />
        <path d="M156 108 L64 140 M156 140 L64 172 M156 172 L68 200" />
      </g>
      <Gloss cx={82} cy={104} rx={22} ry={16} />
      <Face cx={110} cy={156} />
    </svg>
  );
}

function Orange() {
  const uid = useId();
  const g = `orange-${uid}`;
  return (
    <svg viewBox="0 0 220 260" className="h-full w-full">
      <defs>
        <radialGradient id={g} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFB35C" />
          <stop offset="100%" stopColor="#E87E1E" />
        </radialGradient>
      </defs>
      <Shadow />
      <Arms cx={110} cy={152} spread={54} color="#E8862E" />
      <circle cx={110} cy={150} r={84} fill={`url(#${g})`} />
      <path d="M104 62 q7 -22 22 -24" stroke="#5A7A3C" strokeWidth={7} strokeLinecap="round" fill="none" />
      <ellipse cx={130} cy={44} rx={16} ry={9} fill="#5C8C46" transform="rotate(-20 130 44)" />
      <Gloss cx={78} cy={82} rx={26} ry={17} />
      <Face cx={110} cy={150} />
    </svg>
  );
}

function Tomato() {
  const uid = useId();
  const g = `tomato-${uid}`;
  return (
    <svg viewBox="0 0 220 260" className="h-full w-full">
      <defs>
        <radialGradient id={g} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#F27058" />
          <stop offset="100%" stopColor="#C8402E" />
        </radialGradient>
      </defs>
      <Shadow />
      <Arms cx={110} cy={160} spread={56} color="#C8402E" />
      <circle cx={110} cy={158} r={86} fill={`url(#${g})`} />
      <g fill="#4E7A3C">
        <path d="M110 62 L122 90 L94 80 Z" />
        <path d="M110 62 L98 90 L126 80 Z" />
        <path d="M110 62 L138 84 L114 94 Z" />
        <path d="M110 62 L82 84 L106 94 Z" />
      </g>
      <Gloss cx={80} cy={94} rx={26} ry={17} />
      <Face cx={110} cy={158} />
    </svg>
  );
}

function Watermelon() {
  const uid = useId();
  const g = `melon-${uid}`;
  return (
    <svg viewBox="0 0 220 260" className="h-full w-full">
      <defs>
        <radialGradient id={g} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#FF8B87" />
          <stop offset="100%" stopColor="#E14A46" />
        </radialGradient>
      </defs>
      <Shadow />
      <Arms cx={110} cy={152} spread={66} color="#3D8A4E" />
      <circle cx={110} cy={150} r={88} fill="#3D8A4E" />
      <circle cx={110} cy={150} r={74} fill="#F0F0E0" />
      <circle cx={110} cy={150} r={64} fill={`url(#${g})`} />
      <g fill="#2B2318">
        <ellipse cx={80} cy={128} rx={4.5} ry={8} transform="rotate(-20 80 128)" />
        <ellipse cx={142} cy={128} rx={4.5} ry={8} transform="rotate(20 142 128)" />
        <ellipse cx={90} cy={176} rx={4.5} ry={8} transform="rotate(20 90 176)" />
        <ellipse cx={130} cy={176} rx={4.5} ry={8} transform="rotate(-20 130 176)" />
        <ellipse cx={110} cy={108} rx={4.5} ry={8} />
      </g>
      <Gloss cx={80} cy={92} rx={24} ry={16} />
      <Face cx={110} cy={148} />
    </svg>
  );
}

export const FRUIT_SEQUENCE = [Avocado, Mango, Banana, Pineapple, Orange, Tomato, Watermelon];

interface FruitCharacterProps {
  step: number;
  className?: string;
}

export default function FruitCharacter({ step, className = "" }: FruitCharacterProps) {
  const Fruit = FRUIT_SEQUENCE[(step - 1) % FRUIT_SEQUENCE.length];
  return (
    <>
      <style>{`
        @keyframes fruit-float {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
      `}</style>
      <div className={className} style={{ animation: "fruit-float 3.4s ease-in-out infinite" }}>
        <Fruit />
      </div>
    </>
  );
}