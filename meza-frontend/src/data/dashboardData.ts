import type {
  ChecklistItem,
  DayMealPlan,
  DayPlan,
  HydrationGoal,
  NutritionOverview,
  ProgressStat,
  RecipeSummary,
  ShoppingCategory,
  StatCard,
  TodayMeal,
  UpcomingMeal,
} from "../types";

export const TODAY_MEALS: TodayMeal[] = [
  { slot: "breakfast", time: "8:00 AM", name: "Uji wa Wimbi & Ndizi", kcal: 420, minutes: 15, image: "/coastal-low-sodium-pilau.jpg"},
  { slot: "lunch", time: "1:00 PM", name: "Matoke na Nyama Choma", kcal: 510, minutes: 25, image: "/coastal-low-sodium-pilau.jpg" },
  { slot: "dinner", time: "7:00 PM", name: "Sukuma Wiki & Maharagwe", kcal: 580, minutes: 30, image: "/coastal-low-sodium-pilau.jpg"},
];

export const WEEK_PLAN: DayPlan[] = [
  { day: "Mon", isToday: true, meals: ["Uji & Ndizi", "Matoke & Nyama", "Sukuma & Maharagwe"] },
  { day: "Tue", meals: ["Chapati & Mayai", "Fish Stew & Rice", "Mboga Kachumbari"] },
  { day: "Wed", meals: ["Oat Uji & Ndizi", "Githeri", "Kales & Sweet Potato"] },
  { day: "Thu", meals: ["Mandazi & Chai", "Pilau ya Nyama", "Sukuma Wiki"] },
  { day: "Fri", meals: ["Poha", "Kuku Stew & Ugali", "Beans & Carrots"] },
  { day: "Sat", meals: ["Omelette & Toast", "Matoke & Fish", "Veg Stir Fry"] },
  { day: "Sun", meals: ["Uji wa Wimbi", "Mukimo & Nyama", "Kachumbari"] },
];

export const SHOPPING_LIST: ShoppingCategory[] = [
  { name: "Proteins", items: ["Chicken (Kuku) – 1 kg", "Beef – 600 g", "Eggs – 12", "Fish – 500 g"] },
  { name: "Carbohydrates & staples", items: ["Maize flour", "Rice", "Matoke", "Sweet potatoes", "Beans", "Poha"] },
  { name: "Vegetables", items: ["Sukuma wiki", "Spinach", "Tomatoes", "Onions", "Kales", "Carrots"] },
  { name: "Fruits", items: ["Bananas", "Avocados", "Mangoes"] },
];

export const SHOPPING_ITEMS_REMAINING = 12;

export const PROGRESS_STATS: ProgressStat[] = [
  { label: "Meals completed", value: 15, target: 21, icon: "📋" },
  { label: "Water intake", value: 5, target: 7, unit: "days", icon: "💧" },
  { label: "Veg & fruit servings", value: 18, target: 21, icon: "🍏" },
  { label: "Home-cooked meals", value: 4, target: 7, unit: "days", icon: "🍲" },
  { label: "Consistency streak", value: 4, target: 7, unit: "days", icon: "🔥" },
];

export const TODAY_CHECKLIST: ChecklistItem[] = [
  { label: "Prepare breakfast", done: true },
  { label: "Drink 6 glasses of water", done: true },
  { label: "Prepare lunch", done: false },
  { label: "Go for a 20 min walk", done: false },
  { label: "Buy spinach", done: false },
  { label: "Prepare tomorrow's lunch", done: false },
];
export const POPULAR_RECIPES: RecipeSummary[] = [
  { name: "Nyama Choma", minutes: 30, image: "/coastal-low-sodium-pilau.jpg" },
  { name: "Pilau ya Kuku", minutes: 45, image: "/coastal-low-sodium-pilau.jpg" },
  { name: "Ugali & Sukuma", minutes: 25, image: "/coastal-low-sodium-pilau.jpg" },
  { name: "Fish Stew", minutes: 30, image: "/coastal-low-sodium-pilau.jpg" },
  { name: "Mukimo", minutes: 35, image: "/coastal-low-sodium-pilau.jpg" },
];

// ---- Dashboard overview (top stat cards) ----
export const STAT_CARDS: StatCard[] = [
  { label: "Calories Today", value: "1,650", sub: "/ 2,100 kcal", icon: "🔥", progressPct: 79 },
  { label: "Meals Planned", value: "15", sub: "/ 21 this week", icon: "📅" },
  { label: "Shopping Items", value: "12", sub: "in your list", icon: "🛒" },
  { label: "Current Streak", value: "4", sub: "days", icon: "🔥" },
];

// ---- Weekly meal plan with day tabs ----
export const DAY_MEAL_PLANS: DayMealPlan[] = [
  {
    day: "Mon",
    date: "Aug 11",
    isToday: true,
    meals: [
      { slot: "breakfast", label: "Breakfast", time: "8:00 AM", name: "Uji wa Wimbi & Ndizi", kcal: 420, emoji: "🥣", image: "/images/meals/uji-wa-wimbi.jpg" },
      { slot: "lunch", label: "Lunch", time: "1:00 PM", name: "Matoke na Nyama Choma", kcal: 510, emoji: "🍽️", image: "/images/meals/matoke-nyama-choma.jpg" },
      { slot: "dinner", label: "Dinner", time: "7:00 PM", name: "Sukuma Wiki & Maharagwe", kcal: 580, emoji: "🥘", image: "/images/meals/sukuma-maharagwe.jpg" },
      { slot: "snack", label: "Snack", time: "4:00 PM", name: "Mango & Groundnuts", kcal: 140, emoji: "🥭" },
    ],
  },
  {
    day: "Tue",
    date: "Aug 12",
    meals: [
      { slot: "breakfast", label: "Breakfast", time: "8:00 AM", name: "Chapati & Mayai", kcal: 460, emoji: "🍳", image: "/images/meals/chapati-mayai.jpg" },
      { slot: "lunch", label: "Lunch", time: "1:00 PM", name: "Fish Stew & Rice", kcal: 540, emoji: "🐟", image: "/images/meals/fish-stew-rice.jpg" },
      { slot: "dinner", label: "Dinner", time: "7:00 PM", name: "Mboga Kachumbari", kcal: 470, emoji: "🥗" },
    ],
  },
  {
    day: "Wed",
    date: "Aug 13",
    meals: [
      { slot: "breakfast", label: "Breakfast", time: "8:00 AM", name: "Oat Uji & Ndizi", kcal: 400, emoji: "🥣" },
      { slot: "lunch", label: "Lunch", time: "1:00 PM", name: "Githeri", kcal: 520, emoji: "🍛", image: "/images/meals/githeri.jpg" },
      { slot: "dinner", label: "Dinner", time: "7:00 PM", name: "Kales & Sweet Potato", kcal: 460, emoji: "🍠" },
    ],
  },
  {
    day: "Thu",
    date: "Aug 14",
    meals: [
      { slot: "breakfast", label: "Breakfast", time: "8:00 AM", name: "Mandazi & Chai", kcal: 380, emoji: "🍩" },
      { slot: "lunch", label: "Lunch", time: "1:00 PM", name: "Pilau ya Nyama", kcal: 590, emoji: "🍚" },
      { slot: "dinner", label: "Dinner", time: "7:00 PM", name: "Sukuma Wiki", kcal: 430, emoji: "🥬" },
    ],
  },
  {
    day: "Fri",
    date: "Aug 15",
    meals: [
      { slot: "breakfast", label: "Breakfast", time: "8:00 AM", name: "Poha", kcal: 360, emoji: "🍚" },
      { slot: "lunch", label: "Lunch", time: "1:00 PM", name: "Kuku Stew & Ugali", kcal: 560, emoji: "🍗" },
      { slot: "dinner", label: "Dinner", time: "7:00 PM", name: "Beans & Carrots", kcal: 440, emoji: "🥕" },
    ],
  },
  {
    day: "Sat",
    date: "Aug 16",
    meals: [
      { slot: "breakfast", label: "Breakfast", time: "9:00 AM", name: "Omelette & Toast", kcal: 410, emoji: "🍞" },
      { slot: "lunch", label: "Lunch", time: "1:30 PM", name: "Matoke & Fish", kcal: 530, emoji: "🐟" },
      { slot: "dinner", label: "Dinner", time: "7:30 PM", name: "Veg Stir Fry", kcal: 420, emoji: "🥦" },
    ],
  },
  {
    day: "Sun",
    date: "Aug 17",
    meals: [
      { slot: "breakfast", label: "Breakfast", time: "9:00 AM", name: "Uji wa Wimbi", kcal: 390, emoji: "🥣" },
      { slot: "lunch", label: "Lunch", time: "1:30 PM", name: "Mukimo & Nyama", kcal: 570, emoji: "🍖" },
      { slot: "dinner", label: "Dinner", time: "7:30 PM", name: "Kachumbari", kcal: 400, emoji: "🥗" },
    ],
  },
];

// ---- Nutrition overview (macro donut) ----
export const NUTRITION_OVERVIEW: NutritionOverview = {
  avgCalories: 1650,
  targetCalories: 2100,
  macros: [
    { label: "Protein", value: 88, target: 120, unit: "g", colorVar: "#2F4B33" },
    { label: "Carbs", value: 190, target: 230, unit: "g", colorVar: "#C79A56" },
    { label: "Fat", value: 55, target: 70, unit: "g", colorVar: "#B65B3D" },
  ],
};

// ---- Hydration ----
export const HYDRATION_GOAL: HydrationGoal = { current: 5, target: 8 };

// ---- Upcoming meals (right rail) ----
export const UPCOMING_MEALS: UpcomingMeal[] = [
  { name: "Chapati & Mayai", day: "Tue, Aug 12", slot: "Breakfast", emoji: "🍳", image: "/images/meals/chapati-mayai.jpg" },
  { name: "Fish Stew & Rice", day: "Tue, Aug 12", slot: "Lunch", emoji: "🐟", image: "/images/meals/fish-stew-rice.jpg" },
  { name: "Githeri", day: "Wed, Aug 13", slot: "Lunch", emoji: "🍛", image: "/images/meals/githeri.jpg" },
];