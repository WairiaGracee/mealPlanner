def generate_meal_plan_sync(meal_plan: MealPlan) -> None:
    """Runs the Gemini call and writes the result into the DB. Designed to
    be called from a background thread — it handles its own status
    bookkeeping and never raises, so a failure just marks the plan failed
    instead of crashing the thread silently."""

    profile = meal_plan.user.profile
    prompt = _build_prompt(profile)

    meal_plan.status = MealPlan.Status.GENERATING
    meal_plan.prompt = prompt
    meal_plan.save(update_fields=["status", "prompt"])

    try:
        client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": RESPONSE_SCHEMA,
            },
        )
        payload = json.loads(response.text)
        _save_generated_plan(meal_plan, payload)

        meal_plan.status = MealPlan.Status.READY
        meal_plan.save(update_fields=["status"])
    except Exception as exc:  # noqa: BLE001 — any failure marks the plan failed, never crashes silently
        meal_plan.status = MealPlan.Status.FAILED
        meal_plan.error_message = str(exc)[:500]
        meal_plan.save(update_fields=["status", "error_message"])