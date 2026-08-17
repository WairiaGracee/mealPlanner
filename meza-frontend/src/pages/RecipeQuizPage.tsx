import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import {
  IconArrowRight,
  IconCheck,
  IconGamepad,
  IconTrophy,
  IconX,
} from "../components/dashboard/icons";
import { useAuth } from "../context/authContext";
import { getRecipes, type Recipe } from "../lib/mealplans";
import { buildQuizQuestions, type QuizQuestion } from "../lib/RecipeQuiz";

const QUESTION_COUNT = 8;
const MIN_RECIPES_REQUIRED = 4;

type Phase = "intro" | "playing" | "result";

export default function RecipeQuizPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.full_name?.split(" ")[0] ?? "there";

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getRecipes()
      .then((r) => {
        if (!cancelled) setRecipes(r);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function startQuiz() {
    const built = buildQuizQuestions(recipes, QUESTION_COUNT);
    setQuestions(built);
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setPhase(built.length > 0 ? "playing" : "intro");
  }

  function handleAnswer(option: string) {
    if (selected) return;
    setSelected(option);
    const current = questions[currentIndex];
    if (option === current.correctAnswer) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      setPhase("result");
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelected(null);
  }

  const current = questions[currentIndex];
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  let resultMessage = "Keep exploring — try again!";
  if (pct === 100) resultMessage = "Perfect score! Kenyan cuisine master.";
  else if (pct >= 75) resultMessage = "Impressive! You really know your meals.";
  else if (pct >= 50) resultMessage = "Solid effort — a few more rounds and you'll ace it.";

  if (loading) {
    return (
      <DashboardLayout userName={userName}>
        <div className="flex h-64 items-center justify-center text-sm text-inkMuted">
          Loading the quiz…
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 pt-6 sm:pt-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl text-ink">Recipe Quiz</h1>
          <p className="mt-1 text-sm text-inkMuted">
            Test how well you know the meals in your own plan.
          </p>
          <div className="mt-2 h-[3px] w-14 rounded-full bg-clay" />
        </div>

        {phase === "intro" && (
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-line bg-paper px-6 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-light text-forest">
              <IconGamepad className="h-7 w-7" />
            </span>

            {recipes.length < MIN_RECIPES_REQUIRED ? (
              <>
                <div>
                  <h2 className="font-display text-xl text-ink">Not enough recipes yet</h2>
                  <p className="mt-1 max-w-sm text-sm text-inkMuted">
                    You need at least {MIN_RECIPES_REQUIRED} recipes to play. Generate a meal
                    plan to unlock the quiz.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/onboarding")}
                  className="rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
                >
                  Start onboarding
                </button>
              </>
            ) : (
              <>
                <div>
                  <h2 className="font-display text-xl text-ink">Ready to play?</h2>
                  <p className="mt-1 max-w-sm text-sm text-inkMuted">
                    {QUESTION_COUNT} quick questions about calories, regions, and ingredients —
                    all pulled from your {recipes.length} saved recipes.
                  </p>
                </div>
                <button
                  onClick={startQuiz}
                  className="flex items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
                >
                  Start quiz
                  <IconArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        )}

        {phase === "playing" && current && (
          <div className="flex flex-col gap-5">
            {/* Progress + score */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1 overflow-x-auto rounded-full border border-line bg-paper px-2 py-1.5">
                {questions.map((q, i) => (
                  <span
                    key={q.id}
                    className={`h-2 w-2 flex-shrink-0 rounded-full transition-colors ${
                      i === currentIndex
                        ? "bg-forest"
                        : i < currentIndex
                          ? "bg-forest/40"
                          : "bg-line"
                    }`}
                  />
                ))}
                <span className="ml-2 pr-1 text-xs text-inkMuted">
                  {currentIndex + 1} / {questions.length}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-1.5">
                <IconTrophy className="h-4 w-4 text-clay" />
                <span className="text-sm font-medium text-ink">{score}</span>
              </div>
            </div>

            {/* Question card */}
            <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-forest-light text-2xl">
                  {current.recipe.image_url ? (
                    <img
                      src={current.recipe.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    current.recipe.emoji || "🍽️"
                  )}
                </div>
                <p className="pt-1 font-display text-lg leading-snug text-ink">
                  {current.prompt}
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-2.5">
                {current.options.map((option) => {
                  const isCorrect = option === current.correctAnswer;
                  const isSelected = option === selected;
                  const showFeedback = selected !== null;

                  let stateClasses = "border-line bg-paper hover:bg-forest-light/50";
                  if (showFeedback && isCorrect) {
                    stateClasses = "border-forest bg-forest-light text-ink";
                  } else if (showFeedback && isSelected && !isCorrect) {
                    stateClasses = "border-clay bg-clay/10 text-ink";
                  } else if (showFeedback) {
                    stateClasses = "border-line bg-paper opacity-60";
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={showFeedback}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium text-ink transition-colors ${stateClasses}`}
                    >
                      {option}
                      {showFeedback && isCorrect && (
                        <IconCheck className="h-4 w-4 flex-shrink-0 text-forest" />
                      )}
                      {showFeedback && isSelected && !isCorrect && (
                        <IconX className="h-4 w-4 flex-shrink-0 text-clay" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <button
                  onClick={handleNext}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
                >
                  {currentIndex + 1 >= questions.length ? "See results" : "Next question"}
                  <IconArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {phase === "result" && (
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-line bg-paper px-6 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-light text-forest">
              <IconTrophy className="h-7 w-7" />
            </span>
            <div>
              <p className="font-display text-4xl text-ink">
                {score}
                <span className="text-xl text-inkMuted">/{questions.length}</span>
              </p>
              <p className="mt-1 text-sm text-inkMuted">{pct}% correct</p>
            </div>
            <p className="max-w-sm text-sm text-ink">{resultMessage}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={startQuiz}
                className="flex items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
              >
                Play again
                <IconArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-full border border-line bg-paper px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-forest-light"
              >
                Back to dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}