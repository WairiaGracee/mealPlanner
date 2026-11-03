import logging
import threading
from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.db import connection
from django.utils import timezone

from .ai import generate_meal_plan_sync
from .models import MealPlan

logger = logging.getLogger(__name__)
User = get_user_model()


def target_week_start() -> date:
    """The Monday of the week the next plan should cover. From Sunday on that
    is tomorrow, so the shopping list is ready before the week begins."""
    today = timezone.localdate()
    if today.weekday() == 6:
        return today + timedelta(days=1)
    return today - timedelta(days=today.weekday())


def needs_new_plan(user, week_start: date) -> bool:
    """True for onboarded users whose latest finished plan is from an earlier
    week, and who aren't already getting a new one."""
    profile = getattr(user, "profile", None)
    if profile is None or not profile.onboarding_completed:
        return False

    plans = MealPlan.objects.filter(user=user)
    latest_ready = (
        plans.filter(status=MealPlan.Status.READY).order_by("-week_start_date").first()
    )
    if latest_ready is None or latest_ready.week_start_date >= week_start:
        return False

    now = timezone.now()
    busy = plans.filter(
        status__in=[MealPlan.Status.PENDING, MealPlan.Status.GENERATING],
        created_at__gte=now - timedelta(minutes=20),
    ).exists()
    recently_failed = plans.filter(
        status=MealPlan.Status.FAILED,
        week_start_date=week_start,
        created_at__gte=now - timedelta(hours=6),
    ).exists()
    return not (busy or recently_failed)


def generate_and_activate(plan_id) -> None:
    """Generate a plan. If it succeeds, make it the user's active plan and
    refresh their calendar reminders."""
    plan = MealPlan.objects.get(pk=plan_id)
    generate_meal_plan_sync(plan)
    plan.refresh_from_db()
    if plan.status != MealPlan.Status.READY:
        return

    if not plan.is_active:
        MealPlan.objects.filter(user=plan.user, is_active=True).exclude(pk=plan.pk).update(
            is_active=False
        )
        plan.is_active = True
        plan.save(update_fields=["is_active"])

    try:
        from calendarsync.sync import sync_meal_reminders

        sync_meal_reminders(plan.user, plan)
    except Exception:
        logger.exception("Couldn't update meal reminders for user %s", plan.user_id)


def run_in_thread(plan_id) -> None:
    """Thread entry point: generate, log any crash, and release the DB connection."""
    try:
        generate_and_activate(plan_id)
    except Exception:
        logger.exception("Plan generation crashed for plan %s", plan_id)
    finally:
        connection.close()


def maybe_start_weekly_plan(user) -> bool:
    """Called when a user opens the app: quietly start next week's plan if due."""
    week_start = target_week_start()
    if not needs_new_plan(user, week_start):
        return False
    plan = MealPlan.objects.create(
        user=user,
        week_start_date=week_start,
        status=MealPlan.Status.PENDING,
        is_active=False,
    )
    threading.Thread(target=run_in_thread, args=(plan.pk,), daemon=True).start()
    return True


def run_weekly_batch() -> None:
    """Generate this week's plan for every onboarded user who is due one.
    One at a time, so Gemini isn't hit in parallel."""
    try:
        week_start = target_week_start()
        for user in User.objects.filter(is_active=True, profile__onboarding_completed=True):
            try:
                if needs_new_plan(user, week_start):
                    plan = MealPlan.objects.create(
                        user=user,
                        week_start_date=week_start,
                        status=MealPlan.Status.PENDING,
                        is_active=False,
                    )
                    generate_and_activate(plan.pk)
            except Exception:
                logger.exception("Weekly plan failed for user %s", user.pk)
    finally:
        connection.close()