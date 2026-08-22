export interface GuideRecipe {
  id: string;
  name: string;
  region: string;
  tag: string;
  description: string;
  nutritionNote: string;
  image?: string;
}

export const guideRecipes: GuideRecipe[] = [
  {
    id: "guide-sukuma-ugali",
    name: "Sukuma Wiki & Ugali",
    region: "Central & Nationwide",
    tag: "Everyday",
    description:
      "Collard greens sautéed with onion and tomato, served with portioned ugali instead of a free-poured mound.",
    nutritionNote:
      "Sukuma is high in iron and vitamin A; portioning the ugali keeps the carb load predictable instead of guessed by eye.",
    image: "/hero/sukumawiki-ugali.png",
  },
  {
    id: "guide-pilau",
    name: "Coastal Coconut Pilau",
    region: "Coast",
    tag: "Weekend",
    description:
      "Spiced rice cooked in a light coconut-onion base, built to use less salt than a typical restaurant pilau without losing the flavour.",
    nutritionNote:
      "Lower sodium matters most for anyone managing blood pressure — the spice blend does the work salt usually does.",
    image: "/meal-plans/coastal-low-sodium-pilau.jpg",
  },
  {
    id: "guide-nyamachoma",
    name: "Nyama Choma & Kachumbari",
    region: "Rift Valley",
    tag: "Weekend",
    description:
      "Grilled lean cuts with a raw tomato-onion-chili kachumbari, kept to a set portion size rather than an open grill plate.",
    nutritionNote:
      "Lean cuts and a fresh raw side keep this high in protein without the added fat of fattier cuts or fried sides.",
    image: "/hero/nyamachoma.jpg",
  },
  {
    id: "guide-tilapia",
    name: "Grilled Tilapia",
    region: "Lake regions",
    tag: "Everyday",
    description:
      "Whole or filleted tilapia grilled with garlic, lemon and dhania, paired with steamed greens instead of deep frying.",
    nutritionNote:
      "Grilling instead of frying keeps this a lean protein option that still tastes like a proper Kenyan fish plate.",
    image: "/menu/grilled-tilapia.png",
  },
  {
    id: "guide-mukimo",
    name: "Mukimo & Managu",
    region: "Central",
    tag: "Everyday",
    description:
      "Mashed potatoes, maize, peas and pumpkin leaves, served alongside managu (African nightshade) instead of a meat-heavy side.",
    nutritionNote:
      "Managu is naturally low-GI and rich in fibre — a good rotation option for anyone watching blood sugar.",
    image: "/menu/mokimo-managu.png",
  },
  {
    id: "guide-beefstew",
    name: "Beef Stew & Chapati",
    region: "Nationwide",
    tag: "Weekend",
    description:
      "A slow-cooked beef and vegetable stew with a portioned chapati on the side, instead of two or three chapatis by default.",
    nutritionNote:
      "Chapati portioning is usually the single biggest lever for calorie control in this dish — the stew itself is already balanced.",
    image: "/menu/beef-stew-chapati.png",
  },
];

export interface NutritionTip {
  id: string;
  title: string;
  body: string;
}

export const nutritionTips: NutritionTip[] = [
  {
    id: "tip-portion",
    title: "Why we portion staples instead of cutting them",
    body: "Ugali, rice and chapati aren't the problem — an unmeasured serving is. Every recipe here comes with a set portion so you keep eating the food you grew up on, just sized to your goal.",
  },
  {
    id: "tip-sodium",
    title: "Why some coastal recipes are lower-sodium",
    body: "Coastal dishes lean on coconut and salt for flavour. For anyone managing blood pressure, we rebuild the same dishes around spice and acidity instead, so the taste holds up.",
  },
  {
    id: "tip-greens",
    title: "Why indigenous greens show up so often",
    body: "Managu, terere, mrenda and sukuma are naturally low-GI, high in fibre and already part of most Kenyan kitchens — an easy substitution when a plan needs to work harder nutritionally.",
  },
  {
    id: "tip-personalized",
    title: "Why this page is only a starting point",
    body: "These are examples of the reasoning behind our recipes. Your own plan factors in your goal, household size, allergies, cooking time and budget — none of which a static page can do for you.",
  },
];