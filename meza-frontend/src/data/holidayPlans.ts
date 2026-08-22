export interface HolidayPlan {
  id: string;
  occasion: string;
  name: string;
  timing: string;
  description: string;
  servesNote: string;
  tag: string;
  image?: string;
}

export const holidayPlans: HolidayPlan[] = [
  {
    id: "gather-christmas",
    occasion: "Christmas",
    name: "Christmas Day Feast",
    timing: "Dec 25",
    description:
      "Pilau, roast chicken or nyama choma, kachumbari and a green salad, with a make-ahead schedule so you're not cooking all day while everyone's around.",
    servesNote: "Scales from a table of 6 to a full family gathering",
    tag: "Family gathering",
    image: "/meal-plans/high-protein-nyama-choma.jpg",
  },
  {
    id: "gather-easter",
    occasion: "Easter",
    name: "Easter Sunday Lunch",
    timing: "Good Friday – Easter Monday",
    description:
      "A lighter Good Friday fish menu followed by a Sunday lunch spread — chapati, beef stew, and steamed vegetables — planned across the long weekend.",
    servesNote: "Includes a fish-forward Friday option",
    tag: "Long weekend",
    image: "/menu/beef-stew-chapati.png",
  },
  {
    id: "gather-eid",
    occasion: "Eid al-Fitr",
    name: "Eid Homecoming Table",
    timing: "Eid al-Fitr",
    description:
      "Coastal-style biryani and pilau, mahamri for breakfast, and a shopping list sized for visiting relatives dropping in throughout the day.",
    servesNote: "Halal throughout, coastal spice profile",
    tag: "Coastal",
    image: "/meal-plans/coastal-low-sodium-pilau.jpg",
  },
  {
    id: "gather-newyear",
    occasion: "New Year's Day",
    name: "New Year's Day Reset",
    timing: "Jan 1",
    description:
      "A lighter menu built around grilled tilapia, sukuma wiki and mukimo — for the day after the celebrating, when everyone wants something that isn't heavy.",
    servesNote: "Lower-calorie, easy on the stomach",
    tag: "Lighter start",
    image: "/menu/grilled-tilapia.png",
  },
  {
    id: "gather-graduation",
    occasion: "Graduations & send-offs",
    name: "Celebration Send-Off Menu",
    timing: "Any weekend",
    description:
      "A budget-aware spread for hosting a crowd at home — mukimo, managu, and grilled protein — with a grocery list that scales to your guest count.",
    servesNote: "Built to scale: tell us your guest count",
    tag: "Hosting",
    image: "/menu/mokimo-managu.png",
  },
];