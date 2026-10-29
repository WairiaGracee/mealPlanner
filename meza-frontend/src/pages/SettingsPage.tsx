import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { usePreferences } from "../context/PreferencesContext";
import { THEME_PRESETS } from "../lib/preferences";
import type { TranslationKey } from "../i18n/translations";
import {
  IconCalendar,
  IconCheck,
  IconRefresh,
  IconX,
} from "../components/dashboard/icons";
import { useAuth } from "../context/authContext";
import {
  connectGoogleCalendar,
  disconnectGoogleCalendar,
  getCalendarStatus,
  syncActiveMealPlanToCalendar,
  type CalendarStatus,
} from "../lib/calendar";
import { ApiError } from "../lib/api";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { prefs, applyPreset, t } = usePreferences();
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [savingName, setSavingName] = useState(false);
  const userName = user?.full_name?.split(" ")[0] ?? "there";
  const [searchParams, setSearchParams] = useSearchParams();

  const [status, setStatus] = useState<CalendarStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [banner, setBanner] = useState<{ kind: "success" | "error"; message: string } | null>(
    null
  );

  useEffect(() => {
    const calendarParam = searchParams.get("calendar");
    if (calendarParam === "connected") {
      setBanner({ kind: "success", message: "Google Calendar connected." });
    } else if (calendarParam === "error") {
      const reason = searchParams.get("reason");
      setBanner({
        kind: "error",
        message:
          reason === "no_refresh_token"
            ? "Google didn't grant lasting access. Remove Meza from your Google account's Third-party access page, then try connecting again."
            : "Couldn't connect Google Calendar. Please try again.",
      });
    }
    if (calendarParam) {
      searchParams.delete("calendar");
      searchParams.delete("reason");
      setSearchParams(searchParams, { replace: true });
    }
    // Only meant to run once, on the redirect back from Google.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    getCalendarStatus()
      .then((s) => {
        if (!cancelled) setStatus(s);
      })
      .catch(() => {
        if (!cancelled) setStatus({ connected: false, connected_at: null });
      })
      .finally(() => {
        if (!cancelled) setLoadingStatus(false);
      });
    return () => {
      cancelled = true;
    };
  }, [banner]);

    async function handleSaveName() {
    const trimmed = fullName.trim();
    if (!trimmed || trimmed === user?.full_name) return;
    setSavingName(true);
    setBanner(null);
    try {
      await updateProfile({ fullName: trimmed });
      setBanner({ kind: "success", message: "Name updated." });
    } catch {
      setBanner({ kind: "error", message: "Couldn't update your name. Please try again." });
    } finally {
      setSavingName(false);
    }
  }

  async function handleConnect() {
    setConnecting(true);
    setBanner(null);
    try {
      await connectGoogleCalendar();
      // Browser is navigating away to Google — nothing more to do here.
    } catch {
      setConnecting(false);
      setBanner({ kind: "error", message: "Couldn't start Google Calendar connection." });
    }
  }

  async function handleDisconnect() {
    setDisconnecting(true);
    setBanner(null);
    try {
      await disconnectGoogleCalendar();
      setStatus({ connected: false, connected_at: null });
    } catch {
      setBanner({ kind: "error", message: "Couldn't disconnect Google Calendar." });
    } finally {
      setDisconnecting(false);
    }
  }

  async function handleSync() {
    setSyncing(true);
    setBanner(null);
    try {
      const result = await syncActiveMealPlanToCalendar();
      if (result.created === 0 && result.errors.length > 0) {
        setBanner({ kind: "error", message: "Couldn't add reminders to your calendar." });
      } else {
        setBanner({
          kind: "success",
          message: `Added ${result.created} reminder${result.created === 1 ? "" : "s"} to your Google Calendar.`,
        });
      }
    } catch (err) {
      const message =
        err instanceof ApiError && err.body && typeof err.body === "object" && "detail" in err.body
          ? String((err.body as { detail: unknown }).detail)
          : "Couldn't sync your meal plan to Google Calendar.";
      setBanner({ kind: "error", message });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 py-2">
        <div>
          <h1 className="font-display text-2xl text-ink">Settings</h1>
          <p className="mt-1 text-sm text-inkMuted">Manage your account, appearance and integrations.</p>
        </div>

        {banner && (
          <div
            className={`flex items-center gap-3 rounded-2xl border px-5 py-3 text-sm ${
              banner.kind === "success"
                ? "border-forest/30 bg-forest-light/50 text-forest-deep"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {banner.kind === "success" ? (
              <IconCheck className="h-4 w-4 flex-shrink-0" />
            ) : (
              <IconX className="h-4 w-4 flex-shrink-0" />
            )}
            {banner.message}
          </div>
        )}

                <div className="rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-robotoCondensed text-base font-medium text-ink">Account</h2>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="settings-name"
                className="text-xs font-medium uppercase tracking-wide text-inkMuted"
              >
                Full name
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  id="settings-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={150}
                  className="min-w-0 flex-1 rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none focus:border-forest"
                />
                <button
                  onClick={handleSaveName}
                  disabled={savingName || !fullName.trim() || fullName.trim() === user?.full_name}
                  className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep disabled:opacity-60"
                >
                  {savingName ? "Saving…" : "Save"}
                </button>
              </div>
            </div>

            <dl className="grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-inkMuted">Email</dt>
                <dd className="mt-1 break-all text-ink">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-inkMuted">Sign-in</dt>
                <dd className="mt-1 text-ink">
                  {user?.auth_provider === "google" ? "Google" : "Email and password"}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-inkMuted">
                  Member since
                </dt>
                <dd className="mt-1 text-ink">
                  {user?.date_joined
                    ? new Date(user.date_joined).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-robotoCondensed text-base font-medium text-ink">Appearance</h2>
          <p className="mt-1 text-sm text-inkMuted">
            Pick a look for your dashboard. Fine-tune fonts, card style and language from your
            profile menu (top right).
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(THEME_PRESETS) as (keyof typeof THEME_PRESETS)[]).map((preset) => (
              <button
                key={preset}
                onClick={() => applyPreset(preset)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  prefs?.theme_preset === preset
                    ? "border-forest bg-forest text-offwhite"
                    : "border-line bg-paper text-ink hover:bg-forest-light"
                }`}
              >
                {t(`theme_${preset}` as TranslationKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-paper p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
              <IconCalendar className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <h2 className="font-robotoCondensed text-base font-medium text-ink">
                Google Calendar
              </h2>
              <p className="mt-1 text-sm text-inkMuted">
                Get grocery-shopping and meal-prep reminders added straight to your own
                Google Calendar.
              </p>

              <div className="mt-4">
                {loadingStatus ? (
                  <p className="text-sm text-inkMuted">Checking connection…</p>
                ) : status?.connected ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 rounded-full bg-forest-light px-3 py-1.5 text-xs font-medium text-forest-deep">
                      <IconCheck className="h-3.5 w-3.5" />
                      Connected
                    </span>
                    <button
                      onClick={handleSync}
                      disabled={syncing}
                      className="flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep disabled:opacity-60"
                    >
                      <IconRefresh className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                      {syncing ? "Syncing…" : "Sync this week's plan"}
                    </button>
                    <button
                      onClick={handleDisconnect}
                      disabled={disconnecting}
                      className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-60"
                    >
                      {disconnecting ? "Disconnecting…" : "Disconnect"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleConnect}
                    disabled={connecting}
                    className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep disabled:opacity-60"
                  >
                    {connecting ? "Redirecting to Google…" : "Connect Google Calendar"}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-paper p-6 mt-6">
            <h2 className="font-robotoCondensed text-base font-medium text-ink">More</h2>
            <div className="mt-3 flex flex-col divide-y divide-line text-sm">
              {[
                { label: "Edit my meal preferences", path: "/onboarding" },
                { label: "Help & Support", path: "/help" },
                { label: "Privacy Policy", path: "/privacy" },
                { label: "Terms of Service", path: "/terms" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="py-3 text-left text-ink transition-colors hover:text-forest"
                >
                  {item.label}
                </button>
              ))}
            </div>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
}