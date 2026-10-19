"""
WHO healthy-diet targets for Meza meal plans.

Sources encoded here (per adult, per day):
  - Protein 10-15% of energy; safe level 0.83 g/kg body weight (WHO/FAO)
  - Total fat 15-30% of energy; saturated fat < 10%; trans fat < 1%
  - Carbohydrate 55-75% of energy; free sugars < 10% of energy
  - Dietary fibre >= 25 g
  - Salt < 5 g (= sodium < 2,000 mg)
  - Fruit & vegetables >= 400 g (starchy roots like cassava/potato don't count)

App-level assumptions (NOT WHO numbers) are marked ASSUMPTION below.
"""

KCAL_PER_G = {"protein": 4, "carbs": 4, "fat": 9, "sugar": 4}

# Rough head-count per onboarding household option (used to scale the grocery list).
HOUSEHOLD_SIZE = {"solo": 1, "couple": 2, "family_small": 4, "family_large": 5}

# ASSUMPTION: 2,000 kcal is the common WHO/Codex reference diet. We only nudge it by
# goal because onboarding doesn't collect age/sex/activity yet.
BASE_KCAL = 2000
GOAL_KCAL_FACTOR = {"lose_weight": 0.85, "gain_muscle": 1.10}

# Per-meal fields the AI must estimate (added to the Recipe model).
NUTRIENT_FIELDS = [
    "calories", "protein_g", "carbs_g", "fat_g",
    "fiber_g", "free_sugar_g", "sat_fat_g", "sodium_mg", "fruit_veg_g",
]

# Allow for estimation noise before we call something a violation.
SLACK = 0.10


def build_targets(profile) -> dict:
    kcal = round(BASE_KCAL * GOAL_KCAL_FACTOR.get(profile.goal, 1.0))

    protein_pct = (0.10, 0.15)
    carb_pct = (0.45, 0.75)
    fat_pct = (0.15, 0.30)
    # ASSUMPTIONS: respect the user's own choices instead of fighting them.
    if profile.goal == "gain_muscle":
        protein_pct = (0.10, 0.20)
    if profile.diet_style == "low_carb":
        carb_pct = (0.45, 0.55)
        protein_pct = (0.10, 0.20)

    protein_max = kcal * protein_pct[1] / 4
    protein_min = kcal * protein_pct[0] / 4
    if profile.weight_kg:
        protein_min = max(protein_min, 0.83 * profile.weight_kg)
    protein_min = min(protein_min, protein_max)

    return {
        "calories": {"min": kcal * 0.90, "max": kcal * 1.10, "goal": kcal},
        "protein_g": {"min": protein_min, "max": protein_max},
        "carbs_g": {"min": kcal * carb_pct[0] / 4, "max": kcal * carb_pct[1] / 4},
        "fat_g": {"min": kcal * fat_pct[0] / 9, "max": kcal * fat_pct[1] / 9},
        "sat_fat_g": {"max": kcal * 0.10 / 9},
        "free_sugar_g": {"max": kcal * 0.10 / 4},
        "fiber_g": {"min": 25},
        "sodium_mg": {"max": 2000},
        "fruit_veg_g": {"min": 400},
    }


CHECK_LABELS = {
    "calories": ("Energy", "kcal"),
    "protein_g": ("Protein", "g"),
    "carbs_g": ("Carbohydrate", "g"),
    "fat_g": ("Total fat", "g"),
    "sat_fat_g": ("Saturated fat", "g"),
    "free_sugar_g": ("Free sugars", "g"),
    "fiber_g": ("Fibre", "g"),
    "sodium_mg": ("Sodium", "mg"),
    "fruit_veg_g": ("Fruit & vegetables", "g"),
}


def _status(value, limits):
    if value is None:
        return "no_data"
    lo, hi = limits.get("min"), limits.get("max")
    if lo is not None and value < lo * (1 - SLACK):
        return "under"
    if hi is not None and value > hi * (1 + SLACK):
        return "over"
    return "ok"


def _day_totals(meals):
    totals = {}
    for field in NUTRIENT_FIELDS:
        vals = [m.get(field) for m in meals]
        # If any meal is missing a value the day total would be misleading.
        totals[field] = None if (not vals or any(v is None for v in vals)) else sum(vals)
    return totals


def summarize(meals: list, targets: dict) -> dict:
    """
    meals: list of dicts, each with "day_of_week" plus NUTRIENT_FIELDS keys
           (works for AI payload meals and for saved PlannedMeal rows).
    """
    by_day = {}
    for m in meals:
        by_day.setdefault(m["day_of_week"], []).append(m)

    days = []
    for dow in sorted(by_day):
        totals = _day_totals(by_day[dow])
        flags = {k: _status(totals[k], targets[k]) for k in targets}
        days.append({"day_of_week": dow, "totals": totals, "status": flags})

    checks = []
    for key, limits in targets.items():
        vals = [d["totals"][key] for d in days if d["totals"][key] is not None]
        avg = sum(vals) / len(vals) if vals else None
        label, unit = CHECK_LABELS[key]
        checks.append({
            "key": key,
            "label": label,
            "unit": unit,
            "min": limits.get("min"),
            "max": limits.get("max"),
            "weekly_avg": None if avg is None else round(avg, 1),
            "status": _status(avg, limits),
            "days_ok": sum(1 for d in days if d["status"][key] == "ok"),
            "days_total": len(days),
        })

    return {"checks": checks, "days": days, "calorie_goal": targets["calories"]["goal"]}


DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]


def find_issues(meals: list, targets: dict) -> list:
    """Human-readable list of per-day WHO violations, used to ask the AI for a fix."""
    issues = []
    for day in summarize(meals, targets)["days"]:
        for key, status in day["status"].items():
            if status not in ("over", "under"):
                continue
            label, unit = CHECK_LABELS[key]
            lim = targets[key]
            want = (
                f"{round(lim['min'])}-{round(lim['max'])}" if "min" in lim and "max" in lim
                else f"at least {round(lim['min'])}" if "min" in lim
                else f"at most {round(lim['max'])}"
            )
            issues.append(
                f"{DAY_NAMES[day['day_of_week']]}: {label} is {round(day['totals'][key])} {unit} "
                f"({status}); needs {want} {unit}."
            )
    return issues


def build_prompt_block(profile) -> list:
    t = build_targets(profile)
    n = HOUSEHOLD_SIZE.get(profile.household, 1)
    r = lambda k, f: round(t[k][f])  # noqa: E731
    return [
        "",
        "WHO healthy-diet requirements (per person, per day — every single day must meet these):",
        f"- Energy: about {t['calories']['goal']} kcal/day across the three meals.",
        f"- Protein {r('protein_g','min')}-{r('protein_g','max')} g; carbohydrate "
        f"{r('carbs_g','min')}-{r('carbs_g','max')} g; total fat {r('fat_g','min')}-{r('fat_g','max')} g.",
        f"- Saturated fat at most {r('sat_fat_g','max')} g. Limit ghee, butter, cream, cheese, "
        "fatty meat, palm oil and coconut oil/milk; cook with small amounts of sunflower, "
        "soybean, corn, canola or olive oil, and steam, boil or grill instead of frying. "
        "No trans fats of any kind (no margarine or shortening; limit fried and packaged "
        "snacks such as mandazi, samosas, chips and biscuits).",
        f"- Free sugars at most {r('free_sugar_g','max')} g/day. Free sugars include sugar or honey "
        "added to tea/porridge/uji, sugary drinks, honey, syrups and fruit juice. Do not add sugar "
        "to chai, and do not replace it with artificial sweeteners.",
        "- Sodium at most 2000 mg/day (salt < 5 g). Cook with little salt; do NOT rely on stock "
        "cubes or seasoning powders; prefer herbs, onion, garlic, ginger, lemon and spices.",
        "- Fibre at least 25 g/day: use legumes (beans, ndengu/green grams, lentils, njahi, "
        "cowpeas), whole grains (whole-maize ugali, sorghum, millet, brown rice, whole-wheat "
        "chapati) and vegetables.",
        "- At least 400 g/day of fruit and vegetables. Starchy roots and tubers (cassava, potato, "
        "sweet potato, arrowroot) and plantain do NOT count toward this.",
        "- Micronutrients: include dark-green leafy vegetables (sukuma wiki, managu, terere, "
        "spinach) most days, plus iron- and zinc-rich foods (beans, lentils, fish, eggs, lean "
        "meat) and potassium-rich fruit and vegetables (bananas, beans, spinach, avocado). "
        "If salt is used, it should be iodised.",
        "- Include legumes, and nuts or seeds, regularly across the week; prefer fish, poultry "
        "and legumes over red or processed meat; use unsaturated vegetable oil in small amounts.",
        "- For EVERY meal, estimate per single serving: calories, protein_g, carbs_g, fat_g, "
        "fiber_g, free_sugar_g, sat_fat_g, sodium_mg and fruit_veg_g (grams of fruit + "
        "non-starchy vegetables). Make the estimates consistent with the ingredient lists.",
        f"- The household has {n} {'person' if n == 1 else 'people'}. Per-meal nutrition values "
        f"are PER PERSON, but grocery-list quantities must cover all {n} for the full 7 days, "
        "in metric units (g, kg, ml, l) where possible.",
        f"- The grocery list must include enough fruit and vegetables for at least {400 * n * 7} g "
        "over the week, and should not include sugary drinks, sweets or stock cubes.",
    ]