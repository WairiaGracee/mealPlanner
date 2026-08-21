import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { usePreferences } from "../../context/PreferencesContext";
import type {
  BackgroundStyle,
  CardStyle,
  ColorMood,
  Density,
  LanguageCode,
  ThemePreset,
  Typography,
} from "../../lib/preferences";
import { LANGUAGE_OPTIONS, type TranslationKey } from "../../i18n/translations";
import Avatar from "../ui/Avatar";
import {
  IconCamera,
  IconChevronLeft,
  IconChevronRight,
  IconGift,
  IconGlobe,
  IconLink,
  IconPalette,
  IconShield,
  IconUser,
  IconHelp,
  IconBell,
  IconX,
  IconCheck,
} from "../dashboard/icons";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  userName: string;
}

type View = "menu" | "my-profile" | "personalize" | "language" | "placeholder";

// Preview swatches for the preset picker — deliberately hardcoded hex
// (not the live CSS vars) so a preset still shows its true colors even
// while a different theme is currently active.
const PRESET_SWATCHES: Record<Exclude<ThemePreset, "">, string[]> = {
  nourish: ["#2F4B33", "#C79A56", "#FAF6EE"],
  bloom: ["#7A3B4E", "#D98A9C", "#FDF3F3"],
  fresh: ["#1F6E66", "#E0765A", "#F3FAF9"],
  heritage: ["#7A4A2E", "#B65B3D", "#F7EFE1"],
  midnight: ["#16241D", "#6FBF7C", "#1E332A"],
};

export default function ProfileDrawer({ open, onClose, userName }: ProfileDrawerProps) {
  const { user, updateProfile } = useAuth();
  const { prefs, applyPreset, setAxis, setLanguage, t } = usePreferences();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [view, setView] = useState<View>("menu");
  const [placeholderTitle, setPlaceholderTitle] = useState("");

  const [displayName, setDisplayName] = useState(user?.full_name ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    if (open) setView("menu");
  }, [open]);

  useEffect(() => {
    setDisplayName(user?.full_name ?? "");
  }, [user?.full_name]);

  if (!open) return null;

  function openPlaceholder(title: string) {
    setPlaceholderTitle(title);
    setView("placeholder");
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setSavingProfile(true);
    setProfileStatus("idle");
    try {
      await updateProfile({ avatar: file });
      setProfileStatus("saved");
    } catch {
      setProfileStatus("error");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSaveName() {
    setSavingProfile(true);
    setProfileStatus("idle");
    try {
      await updateProfile({ fullName: displayName });
      setProfileStatus("saved");
    } catch {
      setProfileStatus("error");
    } finally {
      setSavingProfile(false);
    }
  }

  const MENU_ITEMS: {
    key: string;
    icon: typeof IconUser;
    label: string;
    onSelect: () => void;
  }[] = [
    { key: "my-profile", icon: IconUser, label: t("drawer_my_profile"), onSelect: () => setView("my-profile") },
    { key: "personalize", icon: IconPalette, label: t("drawer_personalize"), onSelect: () => setView("personalize") },
    { key: "language", icon: IconGlobe, label: t("drawer_language"), onSelect: () => setView("language") },
    { key: "notifications", icon: IconBell, label: t("drawer_notifications"), onSelect: () => openPlaceholder(t("drawer_notifications")) },
    { key: "privacy", icon: IconShield, label: t("drawer_privacy"), onSelect: () => openPlaceholder(t("drawer_privacy")) },
    {
      key: "connected",
      icon: IconLink,
      label: t("drawer_connected_accounts"),
      onSelect: () => {
        onClose();
        navigate("/settings");
      },
    },
    { key: "help", icon: IconHelp, label: t("drawer_help"), onSelect: () => openPlaceholder(t("drawer_help")) },
    { key: "invite", icon: IconGift, label: t("drawer_invite"), onSelect: () => openPlaceholder(t("drawer_invite")) },
  ];

  function PanelHeader({ title }: { title: string }) {
    return (
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        {view !== "menu" && (
          <button
            onClick={() => setView("menu")}
            aria-label={t("drawer_back")}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-forest-light"
          >
            <IconChevronLeft className="h-4 w-4" />
          </button>
        )}
        <h2 className="flex-1 font-display text-lg text-ink">{title}</h2>
        <button
          onClick={onClose}
          aria-label={t("drawer_close")}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-forest-light"
        >
          <IconX className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-charcoal/40" onClick={onClose} />

      <aside className="relative flex h-full w-full max-w-sm flex-col bg-paper shadow-2xl">
        {view === "menu" && (
          <>
            <div className="flex items-center gap-4 border-b border-line px-5 py-5">
              <Avatar name={userName} imageUrl={user?.avatar_url} className="h-14 w-14 text-base" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg text-ink">{userName}</p>
                <p className="truncate text-sm text-inkMuted">{user?.email}</p>
              </div>
              <button
                onClick={onClose}
                aria-label={t("drawer_close")}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-forest-light"
              >
                <IconX className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-2">
              {MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                const isPlaceholder = ["notifications", "privacy", "help", "invite"].includes(
                  item.key
                );
                return (
                  <button
                    key={item.key}
                    onClick={item.onSelect}
                    className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm text-ink transition-colors hover:bg-forest-light"
                  >
                    <Icon className="h-[18px] w-[18px] flex-shrink-0 text-inkMuted" />
                    <span className="flex-1">{item.label}</span>
                    {isPlaceholder && (
                      <span className="rounded-full bg-line px-2 py-0.5 text-[11px] text-inkMuted">
                        {t("drawer_coming_soon")}
                      </span>
                    )}
                    <IconChevronRight className="h-4 w-4 flex-shrink-0 text-inkMuted" />
                  </button>
                );
              })}
            </nav>
          </>
        )}

        {view === "my-profile" && (
          <>
            <PanelHeader title={t("drawer_my_profile")} />
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <Avatar
                    name={userName}
                    imageUrl={avatarPreview ?? user?.avatar_url}
                    className="h-24 w-24 text-2xl"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    aria-label={t("profile_change_photo")}
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-forest text-offwhite shadow-md transition-colors hover:bg-forest-deep"
                  >
                    <IconCamera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium text-forest hover:text-forest-deep"
                >
                  {t("profile_change_photo")}
                </button>
              </div>

              <div className="mt-8 flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-inkMuted">
                    {t("profile_display_name")}
                  </span>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-forest focus:outline-none"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-inkMuted">
                    {t("profile_email")}
                  </span>
                  <input
                    type="email"
                    value={user?.email ?? ""}
                    disabled
                    className="rounded-xl border border-line bg-forest-light/40 px-4 py-2.5 text-sm text-inkMuted"
                  />
                </label>

                <button
                  onClick={handleSaveName}
                  disabled={savingProfile || displayName === user?.full_name}
                  className="mt-2 rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep disabled:opacity-50"
                >
                  {savingProfile ? t("profile_saving") : t("profile_save")}
                </button>

                {profileStatus === "saved" && (
                  <p className="flex items-center gap-1.5 text-sm text-forest">
                    <IconCheck className="h-4 w-4" /> {t("profile_saved")}
                  </p>
                )}
                {profileStatus === "error" && (
                  <p className="text-sm text-red-600">{t("profile_error")}</p>
                )}
              </div>
            </div>
          </>
        )}

        {view === "personalize" && (
          <>
            <PanelHeader title={t("personalize_title")} />
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <p className="text-sm text-inkMuted">{t("personalize_subtitle")}</p>

              <p className="mt-6 text-xs font-medium uppercase tracking-wide text-inkMuted">
                {t("personalize_presets")}
              </p>
              <div className="mt-2 grid grid-cols-1 gap-2">
                {(Object.keys(PRESET_SWATCHES) as Exclude<ThemePreset, "">[]).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => applyPreset(preset)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      prefs?.theme_preset === preset
                        ? "border-forest bg-forest-light/60"
                        : "border-line hover:bg-forest-light/30"
                    }`}
                  >
                    <span className="flex flex-shrink-0 -space-x-1.5">
                      {PRESET_SWATCHES[preset].map((hex, i) => (
                        <span
                          key={i}
                          className="h-5 w-5 rounded-full border-2 border-paper"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </span>
                    <span className="flex-1 font-medium text-ink">
                      {t(`theme_${preset}` as TranslationKey)}
                    </span>
                    {prefs?.theme_preset === preset && (
                      <IconCheck className="h-4 w-4 flex-shrink-0 text-forest" />
                    )}
                  </button>
                ))}
              </div>

              {!prefs?.theme_preset && (
                <p className="mt-3 text-xs italic text-inkMuted">{t("personalize_custom")}</p>
              )}

              <div className="mt-6 flex flex-col gap-5">
                <ChipRow
                  label={t("personalize_color_mood")}
                  value={prefs?.color_mood}
                  options={(["nourish", "bloom", "fresh", "heritage", "midnight"] as ColorMood[]).map(
                    (v) => ({ value: v, label: t(`theme_${v}` as TranslationKey) })
                  )}
                  onChange={(v) => setAxis("color_mood", v as ColorMood)}
                />
                <ChipRow
                  label={t("personalize_typography")}
                  value={prefs?.typography}
                  options={(["modern", "friendly", "elegant", "minimal"] as Typography[]).map((v) => ({
                    value: v,
                    label: t(`typography_${v}` as TranslationKey),
                  }))}
                  onChange={(v) => setAxis("typography", v as Typography)}
                />
                <ChipRow
                  label={t("personalize_card_style")}
                  value={prefs?.card_style}
                  options={(["sharp", "rounded", "soft"] as CardStyle[]).map((v) => ({
                    value: v,
                    label: t(`card_style_${v}` as TranslationKey),
                  }))}
                  onChange={(v) => setAxis("card_style", v as CardStyle)}
                />
                <ChipRow
                  label={t("personalize_background")}
                  value={prefs?.background_style}
                  options={(["pattern", "warm_pattern", "plain", "dark"] as BackgroundStyle[]).map(
                    (v) => ({ value: v, label: t(`background_${v}` as TranslationKey) })
                  )}
                  onChange={(v) => setAxis("background_style", v as BackgroundStyle)}
                />
                <ChipRow
                  label={t("personalize_density")}
                  value={prefs?.density}
                  options={(["compact", "comfortable", "spacious"] as Density[]).map((v) => ({
                    value: v,
                    label: t(`density_${v}` as TranslationKey),
                  }))}
                  onChange={(v) => setAxis("density", v as Density)}
                />
              </div>
            </div>
          </>
        )}

        {view === "language" && (
          <>
            <PanelHeader title={t("language_title")} />
            <div className="flex-1 overflow-y-auto px-5 py-6">
              <p className="text-sm text-inkMuted">{t("language_subtitle")}</p>
              <div className="mt-5 flex flex-col gap-1.5">
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => setLanguage(opt.code as LanguageCode)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      prefs?.language === opt.code
                        ? "border-forest bg-forest-light/60"
                        : "border-line hover:bg-forest-light/30"
                    }`}
                  >
                    <span className="flex-1 font-medium text-ink">{opt.label}</span>
                    {!opt.translated && (
                      <span className="rounded-full bg-line px-2 py-0.5 text-[11px] text-inkMuted">
                        {t("drawer_coming_soon")}
                      </span>
                    )}
                    {prefs?.language === opt.code && (
                      <IconCheck className="h-4 w-4 flex-shrink-0 text-forest" />
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs italic text-inkMuted">{t("language_more_coming")}</p>
            </div>
          </>
        )}

        {view === "placeholder" && (
          <>
            <PanelHeader title={placeholderTitle} />
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-5 text-center">
              <p className="font-display text-lg text-ink">{placeholderTitle}</p>
              <p className="max-w-xs text-sm text-inkMuted">
                {t("drawer_coming_soon")} — this section isn't built yet.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function ChipRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-inkMuted">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              value === opt.value
                ? "border-forest bg-forest text-offwhite"
                : "border-line text-ink/70 hover:border-forest/50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}