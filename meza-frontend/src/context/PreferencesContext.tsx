import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./authContext";
import { getPreferences, updatePreferences, THEME_PRESETS } from "../lib/preferences";
import type { ThemePreset, UserPreferences } from "../lib/preferences";
import { translations, type TranslationKey } from "../i18n/translations";

interface PreferencesContextValue {
  prefs: UserPreferences | null;
  loading: boolean;
  // Apply a named preset — sets every axis at once.
  applyPreset: (preset: Exclude<ThemePreset, "">) => Promise<void>;
  // Override a single axis. Clears theme_preset to "" (custom) since it
  // no longer matches a single named preset, matching the backend
  // model's documented intent.
  setAxis: <K extends keyof Omit<UserPreferences, "updated_at" | "theme_preset">>(
    key: K,
    value: UserPreferences[K]
  ) => Promise<void>;
  setLanguage: (language: UserPreferences["language"]) => Promise<void>;
  t: (key: TranslationKey) => string;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

function applyThemeToDom(prefs: UserPreferences) {
  const root = document.documentElement;
  root.setAttribute("data-theme", prefs.color_mood);
  root.setAttribute("data-typography", prefs.typography);
  root.setAttribute("data-card-style", prefs.card_style);
  root.setAttribute("data-background", prefs.background_style);
  root.setAttribute("data-density", prefs.density);
  root.setAttribute("lang", prefs.language);
}

const DEFAULT_PREFS: UserPreferences = {
  theme_preset: "nourish",
  color_mood: "nourish",
  typography: "modern",
  card_style: "rounded",
  background_style: "pattern",
  density: "comfortable",
  language: "en",
  updated_at: "",
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPrefs(null);
      applyThemeToDom(DEFAULT_PREFS);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getPreferences()
      .then((p) => {
        if (cancelled) return;
        setPrefs(p);
        applyThemeToDom(p);
      })
      .catch(() => {
        if (cancelled) return;
        setPrefs(DEFAULT_PREFS);
        applyThemeToDom(DEFAULT_PREFS);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const persist = useCallback(async (patch: Partial<UserPreferences>) => {
    const updated = await updatePreferences(patch);
    setPrefs(updated);
    applyThemeToDom(updated);
  }, []);

  const applyPreset = useCallback(
    async (preset: Exclude<ThemePreset, "">) => {
      await persist({ theme_preset: preset, ...THEME_PRESETS[preset] });
    },
    [persist]
  );

  const setAxis = useCallback(
    async <K extends keyof Omit<UserPreferences, "updated_at" | "theme_preset">>(
      key: K,
      value: UserPreferences[K]
    ) => {
      await persist({ theme_preset: "", [key]: value } as Partial<UserPreferences>);
    },
    [persist]
  );

  const setLanguage = useCallback(
    async (language: UserPreferences["language"]) => {
      await persist({ language });
    },
    [persist]
  );

  const t = useCallback(
    (key: TranslationKey) => {
      const lang = prefs?.language === "sw" ? "sw" : "en";
      return translations[lang][key] ?? translations.en[key];
    },
    [prefs?.language]
  );

  return (
    <PreferencesContext.Provider
      value={{ prefs, loading, applyPreset, setAxis, setLanguage, t }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used inside a PreferencesProvider");
  }
  return ctx;
}