import type { MealPlanPreview } from "../types";

export const mealPlanPreviews: MealPlanPreview[] = [
  {
    id: "plan-1",
    slug: "lean-sukuma-ugali-week",
    name: "Lean Sukuma & Ugali Week",
    tag: "Weight loss",
    region: "Central & Nationwide",
    description:
      "Portion-controlled ugali paired with iron-rich sukuma wiki and grilled protein — built for a calorie deficit without cutting out staples.",
    calories: "1,650 kcal / day avg",
    image: "/meal-plans/lean-sukuma-ugali-week.png",
    prepTime: "25–35 min / meal",
  },
  {
    id: "plan-2",
    slug: "coastal-low-sodium-pilau",
    name: "Coastal Low-Sodium Pilau",
    tag: "Hypertension-friendly",
    region: "Coast",
    description:
      "A coconut-forward coastal rotation with reduced salt and smart spice substitutions, so flavour doesn't get lost when sodium comes down.",
    calories: "1,850 kcal / day avg",
    image: "/meal-plans/coastal-low-sodium-pilau.jpg",
    prepTime: "30–40 min / meal",
  },
  {
    id: "plan-3",
    slug: "high-protein-nyama-choma",
    name: "High-Protein Nyama Choma Plan",
    tag: "Muscle gain",
    region: "Rift Valley",
    description:
      "Lean cuts, kachumbari, and slow-carb sides scaled for a calorie surplus — weekend grill favourites turned into a structured plan.",
    calories: "2,600 kcal / day avg",
    image: "/meal-plans/high-protein-nyama-choma.jpg",
    prepTime: "35–45 min / meal",
  },
];