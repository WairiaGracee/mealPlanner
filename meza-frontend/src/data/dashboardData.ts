import type {
  ChecklistItem,
  DayPlan,
  ProgressStat,
  RecipeSummary,
  ShoppingCategory,
  TodayMeal,
} from "../types";

export const TODAY_MEALS: TodayMeal[] = [
  { slot: "breakfast", time: "8:00 AM", name: "Uji wa Wimbi & Ndizi", kcal: 420, minutes: 15, emoji: "🥣" },
  { slot: "lunch", time: "1:00 PM", name: "Matoke na Nyama Choma", kcal: 510, minutes: 25, emoji: "🍽️" },
  { slot: "dinner", time: "7:00 PM", name: "Sukuma Wiki & Maharagwe", kcal: 580, minutes: 30, emoji: "🥘" },
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
  { name: "Nyama Choma", minutes: 30, emoji: "🍖" },
  { name: "Pilau ya Kuku", minutes: 45, emoji: "🍚" },
  { name: "Ugali & Sukuma", minutes: 25, emoji: "🥬" },
  { name: "Fish Stew", minutes: 30, emoji: "🐟" },
  { name: "Mukimo", minutes: 35, emoji: "🥔" },
];