import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useAuth } from "../context/authContext";

const WORDS = ["Coming", "Soon"];

export default function ComingSoonPage({ title }: { title: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.full_name?.split(" ")[0] ?? "there";

  let letterIndex = 0;

  return (
    <DashboardLayout userName={userName}>
      <style>{`
        .jump-letter {
          display: inline-block;
          animation:
            letter-drop 700ms cubic-bezier(0.34, 1.56, 0.64, 1) both,
            letter-jump 2.2s ease-in-out infinite;
          animation-delay: calc(var(--i) * 90ms), calc(1200ms + var(--i) * 110ms);
        }
        @keyframes letter-drop {
          from { opacity: 0; transform: translateY(-140px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes letter-jump {
          0%, 55%, 100% { transform: translateY(0); }
          20% { transform: translateY(-22px); }
          35% { transform: translateY(0); }
          45% { transform: translateY(-6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .jump-letter { animation: none; }
        }
      `}</style>

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-2 pt-16 text-center sm:pt-24">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-inkMuted">
          Food Games
        </p>
        <h1 className="font-display text-2xl text-ink sm:text-3xl">{title}</h1>

        <h2
          aria-label="Coming soon"
          className="mt-4 flex flex-wrap justify-center font-display text-6xl text-forest sm:text-8xl"
        >
          {WORDS.map((word) => (
            <span key={word} aria-hidden="true" className="mx-2 inline-flex sm:mx-4">
              {word.split("").map((ch) => {
                const i = letterIndex++;
                return (
                  <span key={i} className="jump-letter" style={{ "--i": i } as CSSProperties}>
                    {ch}
                  </span>
                );
              })}
            </span>
          ))}
        </h2>

        <p className="mt-4 max-w-md text-sm text-inkMuted">
          We're still cooking this one up. Check back soon, or test your Kenyan kitchen
          knowledge with the Recipe Quiz in the meantime.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate("/games/recipe-quiz")}
            className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
          >
            Try the Recipe Quiz
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-full border border-line bg-paper px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-forest-light"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}