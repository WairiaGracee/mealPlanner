import type { Recipe } from "./mealplans";

export type QuizQuestionType = "calories" | "region" | "ingredient";

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  recipe: Recipe;
  prompt: string;
  options: string[];
  correctAnswer: string;
}

const FALLBACK_REGIONS = [
  "Coastal",
  "Central",
  "Rift Valley",
  "Nyanza",
  "Western",
  "Eastern",
  "Nairobi",
  "North Eastern",
];

const FALLBACK_INGREDIENTS = [
  "Sukuma wiki",
  "Ugali flour",
  "Coconut milk",
  "Groundnuts",
  "Basmati rice",
  "Dried beans",
  "Ripe tomatoes",
  "Red onions",
  "Garlic cloves",
  "Fresh ginger",
  "Chapati flour",
  "Pilau spice mix",
  "Green bananas",
  "Cassava",
  "Sweet potatoes",
  "Green lentils",
];

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sampleDistinct(pool: string[], correct: string, count: number): string[] {
  const unique = Array.from(new Set(pool.filter((v) => v && v !== correct)));
  return shuffle(unique).slice(0, count);
}

function buildCaloriesQuestion(recipe: Recipe, allRecipes: Recipe[]): QuizQuestion | null {
  if (recipe.calories == null) return null;
  const correct = `${recipe.calories} kcal`;

  const otherCalories = allRecipes
    .filter((r) => r.id !== recipe.id && r.calories != null)
    .map((r) => `${r.calories} kcal`);

  let distractors = sampleDistinct(otherCalories, correct, 3);

  // Pad with synthetic offsets if there isn't enough real variety.
  const offsets = [60, -60, 120, -120, 180, -180];
  let i = 0;
  while (distractors.length < 3 && i < offsets.length) {
    const candidate = `${Math.max(50, recipe.calories + offsets[i])} kcal`;
    if (candidate !== correct && !distractors.includes(candidate)) {
      distractors.push(candidate);
    }
    i++;
  }

  const options = shuffle([correct, ...distractors.slice(0, 3)]);
  return {
    id: `${recipe.id}-calories`,
    type: "calories",
    recipe,
    prompt: `About how many calories are in "${recipe.name}"?`,
    options,
    correctAnswer: correct,
  };
}

function buildRegionQuestion(recipe: Recipe, allRecipes: Recipe[]): QuizQuestion | null {
  if (!recipe.region) return null;
  const correct = recipe.region;

  const otherRegions = allRecipes.filter((r) => r.id !== recipe.id).map((r) => r.region);
  const pool = [...otherRegions, ...FALLBACK_REGIONS];
  const distractors = sampleDistinct(pool, correct, 3);

  if (distractors.length < 3) return null;

  const options = shuffle([correct, ...distractors]);
  return {
    id: `${recipe.id}-region`,
    type: "region",
    recipe,
    prompt: `Which region does "${recipe.name}" come from?`,
    options,
    correctAnswer: correct,
  };
}

function buildIngredientQuestion(recipe: Recipe, allRecipes: Recipe[]): QuizQuestion | null {
  if (!recipe.ingredients || recipe.ingredients.length === 0) return null;
  const correct = recipe.ingredients[Math.floor(Math.random() * recipe.ingredients.length)].name;

  const ownIngredientNames = new Set(recipe.ingredients.map((ing) => ing.name));
  const otherIngredients = allRecipes
    .filter((r) => r.id !== recipe.id)
    .flatMap((r) => r.ingredients.map((ing) => ing.name))
    .filter((name) => !ownIngredientNames.has(name));

  const pool = [...otherIngredients, ...FALLBACK_INGREDIENTS];
  const distractors = sampleDistinct(pool, correct, 3);

  if (distractors.length < 3) return null;

  const options = shuffle([correct, ...distractors]);
  return {
    id: `${recipe.id}-ingredient`,
    type: "ingredient",
    recipe,
    prompt: `Which of these is an ingredient in "${recipe.name}"?`,
    options,
    correctAnswer: correct,
  };
}

const BUILDERS = [buildCaloriesQuestion, buildRegionQuestion, buildIngredientQuestion];

/** Builds up to `count` multiple-choice questions from the user's own recipes. */
export function buildQuizQuestions(recipes: Recipe[], count = 8): QuizQuestion[] {
  if (recipes.length === 0) return [];

  const shuffledRecipes = shuffle(recipes);
  const questions: QuizQuestion[] = [];
  const usedIds = new Set<string>();

  // Round-robin across recipes and question types for variety.
  let builderIndex = 0;
  let attempts = 0;
  const maxAttempts = shuffledRecipes.length * BUILDERS.length * 2;

  while (questions.length < count && attempts < maxAttempts) {
    const recipe = shuffledRecipes[attempts % shuffledRecipes.length];
    const builder = BUILDERS[builderIndex % BUILDERS.length];
    builderIndex++;
    attempts++;

    const question = builder(recipe, recipes);
    if (question && !usedIds.has(question.id)) {
      usedIds.add(question.id);
      questions.push(question);
    }
  }

  return shuffle(questions).slice(0, count);
}