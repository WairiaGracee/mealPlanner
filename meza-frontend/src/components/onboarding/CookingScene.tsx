import { useId } from "react";

function Steam({ x, delay }: { x: number; delay: number }) {
  return (
    <path
      d={`M ${x} 150 q -8 -18 0 -34 q 8 -16 0 -32`}
      stroke="#B9C7B4"
      strokeWidth={5}
      strokeLinecap="round"
      fill="none"
      opacity={0.65}
      style={{
        animation: `steam-rise 2.6s ease-in-out ${delay}s infinite`,
        transformOrigin: "center",
      }}
    />
  );
}

function Particle({
  x,
  y,
  delay,
  children,
}: {
  x: number;
  y: number;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      style={{ animation: `particle-drift 4s ease-in-out ${delay}s infinite` }}
    >
      {children}
    </g>
  );
}

export default function CookingScene({ className = "" }: { className?: string }) {
  const uid = useId();
  const avoG = `cook-avo-${uid}`;
  const potG = `cook-pot-${uid}`;
  const orgG = `cook-org-${uid}`;

  return (
    <div className={className}>
      <style>{`
        @keyframes gentle-bob {
          0%, 100% { transform: translateY(0) rotate(-1.5deg); }
          50% { transform: translateY(-8px) rotate(1.5deg); }
        }
        @keyframes steam-rise {
          0% { transform: translateY(4px); opacity: 0.15; }
          50% { transform: translateY(-10px); opacity: 0.7; }
          100% { transform: translateY(-22px); opacity: 0; }
        }
        @keyframes particle-drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.85; }
          50% { transform: translate(4px, -14px) rotate(12deg); opacity: 1; }
        }
      `}</style>
      <svg viewBox="0 0 420 320" className="h-full w-full">
        <defs>
          <radialGradient id={avoG} cx="35%" cy="28%" r="80%">
            <stop offset="0%" stopColor="#8CAE6C" />
            <stop offset="100%" stopColor="#527A3E" />
          </radialGradient>
          <radialGradient id={orgG} cx="35%" cy="28%" r="80%">
            <stop offset="0%" stopColor="#FFB35C" />
            <stop offset="100%" stopColor="#E87E1E" />
          </radialGradient>
          <linearGradient id={potG} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3D5A40" />
            <stop offset="100%" stopColor="#243A28" />
          </linearGradient>
        </defs>

        <ellipse cx={210} cy={296} rx={130} ry={14} fill="#2B2318" opacity={0.08} />

        {/* Floating ingredient particles */}
        <Particle x={90} y={60} delay={0}>
          <circle r={9} fill="#D9483A" />
          <circle r={5} fill="#F2A93C" opacity={0.6} />
        </Particle>
        <Particle x={330} y={70} delay={0.6}>
          <ellipse rx={10} ry={7} fill="none" stroke="#E8E2D3" strokeWidth={3} />
        </Particle>
        <Particle x={200} y={40} delay={1.2}>
          <path d="M0 -8 Q8 0 0 8 Q-8 0 0 -8 Z" fill="#5C8C46" />
        </Particle>
        <Particle x={260} y={30} delay={1.8}>
          <path d="M0 -6 L2 -2 L6 0 L2 2 L0 6 L-2 2 L-6 0 L-2 -2 Z" fill="#F2A93C" />
        </Particle>

        {/* Avocado, stirring */}
        <g style={{ animation: "gentle-bob 3.4s ease-in-out infinite", transformOrigin: "90px 240px" }}>
          <path
            d="M90 140 C130 140 146 190 140 232 C134 274 112 288 90 288 C68 288 46 274 40 232 C34 190 50 140 90 140 Z"
            fill={`url(#${avoG})`}
          />
          <path
            d="M90 156 C118 156 130 194 126 226 C122 260 106 272 90 272 C74 272 58 260 54 226 C50 194 62 156 90 156 Z"
            fill="#EFE1B0"
          />
          <circle cx={90} cy={224} r={18} fill="#8B5A34" />
          <path
            d="M90 60 C130 60 148 96 146 130 C132 108 108 96 84 92 C76 84 82 66 90 60 Z"
            fill="#5C8C46"
          />
          <path
            d="M72 220 q30 -18 60 4"
            stroke="#3D5A40"
            strokeWidth={8}
            strokeLinecap="round"
            fill="none"
          />
          <circle cx={130} cy={222} r={7} fill="#3D5A40" />
          <path d="M60 232 q -14 4 -18 -4" stroke="#3D5A40" strokeWidth={8} strokeLinecap="round" fill="none" />
          <path d="M76 200 q9 -11 18 0" stroke="#2B2318" strokeWidth={4} strokeLinecap="round" fill="none" />
          <path d="M100 200 q9 -11 18 0" stroke="#2B2318" strokeWidth={4} strokeLinecap="round" fill="none" />
          <circle cx={68} cy={214} r={5} fill="#F4A896" opacity={0.55} />
          <circle cx={126} cy={214} r={5} fill="#F4A896" opacity={0.55} />
          <path d="M84 213 q6 8 13 0" stroke="#2B2318" strokeWidth={4} strokeLinecap="round" fill="none" />
        </g>

        {/* Pot */}
        <g>
          <Steam x={190} delay={0} />
          <Steam x={210} delay={0.5} />
          <Steam x={230} delay={1} />
          <ellipse cx={210} cy={158} rx={70} ry={16} fill="#1E3323" />
          <path d="M140 158 L150 240 Q150 264 210 264 Q270 264 270 240 L280 158 Z" fill={`url(#${potG})`} />
          <ellipse cx={210} cy={158} rx={62} ry={13} fill="#F2A93C" opacity={0.9} />
          <path d="M115 175 q-16 4 -14 22 q2 16 20 14" stroke="#1E3323" strokeWidth={9} strokeLinecap="round" fill="none" />
          <path d="M305 175 q16 4 14 22 q-2 16 -20 14" stroke="#1E3323" strokeWidth={9} strokeLinecap="round" fill="none" />
          <path d="M198 214 q12 -16 24 0 q-12 16 -24 0 Z" fill="#C79A56" opacity={0.85} />
        </g>

        {/* Orange chef, stirring */}
        <g style={{ animation: "gentle-bob 3.4s ease-in-out 0.4s infinite", transformOrigin: "330px 240px" }}>
          <circle cx={330} cy={228} r={58} fill={`url(#${orgG})`} />
          <path
            d="M290 186 Q330 158 370 186 Q378 168 362 158 Q330 142 298 158 Q282 168 290 186 Z"
            fill="#FAF6EE"
          />
          <rect x={296} y={182} width={68} height={10} rx={5} fill="#FAF6EE" />
          <path
            d="M298 232 q22 16 44 -2"
            stroke="#E8862E"
            strokeWidth={8}
            strokeLinecap="round"
            fill="none"
          />
          <circle cx={252} cy={222} r={7} fill="#E8862E" />
          <path d="M366 236 q14 6 16 -4" stroke="#E8862E" strokeWidth={8} strokeLinecap="round" fill="none" />
          <path d="M308 214 q9 -11 18 0" stroke="#2B2318" strokeWidth={4} strokeLinecap="round" fill="none" />
          <path d="M334 214 q9 -11 18 0" stroke="#2B2318" strokeWidth={4} strokeLinecap="round" fill="none" />
          <circle cx={300} cy={228} r={5} fill="#F4A896" opacity={0.55} />
          <circle cx={360} cy={228} r={5} fill="#F4A896" opacity={0.55} />
          <path d="M316 227 q14 17 30 0" stroke="#2B2318" strokeWidth={4} strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </div>
  );
}