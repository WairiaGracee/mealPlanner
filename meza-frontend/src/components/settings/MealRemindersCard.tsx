import { useEffect, useState } from "react";
import { getReminderSettings, saveReminderSettings } from "../../lib/calendar";

// Keep these times in step with MEAL_HOURS in calendarsync/sync.py
const MEALS = [
  { key: "breakfast", label: "Breakfast", time: "8:00 am" },
  { key: "lunch", label: "Lunch", time: "1:00 pm" },
  { key: "dinner", label: "Dinner", time: "7:00 pm" },
];

export default function MealRemindersCard() {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [meals, setMeals] = useState<string[]>(["lunch"]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;
    getReminderSettings()
      .then((s) => {
        if (cancelled) return;
        setConnected(s.connected);
        setEnabled(s.enabled);
        if (s.meals.length > 0) setMeals(s.meals);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleMeal(key: string) {
    setMeals((current) =>
      current.includes(key) ? current.filter((m) => m !== key) : [...current, key]
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const result = await saveReminderSettings({ enabled, meals });
      setConnected(result.connected);
      if (result.error) {
        setMessage({ kind: "error", text: result.error });
      } else if (!enabled) {
        setMessage({
          kind: "success",
          text: "Meal reminders are off, and upcoming ones were removed from your calendar.",
        });
      } else if ((result.created ?? 0) > 0) {
        setMessage({
          kind: "success",
          text: `Done. ${result.created} reminders were added to your Google Calendar.`,
        });
      } else {
        setMessage({
          kind: "success",
          text: "Saved. Reminders will be added for upcoming meals as your plans are created.",
        });
      }
    } catch (err) {
      setMessage({
        kind: "error",
        text: err instanceof Error ? err.message : "Couldn't save. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-paper p-6">
      <h2 className="font-robotoCondensed text-base font-medium text-ink">Meal reminders</h2>
      <p className="mt-1 text-sm text-inkMuted">
        Get a notification on your phone one hour before each meal. Reminders are added to your
        Google Calendar, so make sure notifications are switched on in the Google Calendar app.
      </p>

      {loading ? (
        <p className="mt-4 text-sm text-inkMuted">Loading…</p>
      ) : !connected ? (
        <p className="mt-4 text-sm text-inkMuted">
          Connect Google Calendar above to turn meal reminders on.
        </p>
      ) : (
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-ink">Remind me before meals</span>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled((v) => !v)}
              className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                enabled ? "bg-forest" : "bg-line"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  enabled ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          {enabled && (
            <div className="flex flex-col gap-2">
              {MEALS.map((m) => (
                <label key={m.key} className="flex items-center gap-3 text-sm text-ink">
                  <input
                    type="checkbox"
                    checked={meals.includes(m.key)}
                    onChange={() => toggleMeal(m.key)}
                    className="h-4 w-4 accent-forest"
                  />
                  {m.label}
                  <span className="text-xs text-inkMuted">notified at {m.time} minus 1 hour</span>
                </label>
              ))}
            </div>
          )}

          {message && (
            <p className={`text-sm ${message.kind === "error" ? "text-clay" : "text-forest"}`}>
              {message.text}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="self-start rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}