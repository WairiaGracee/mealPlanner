import { useNavigate } from "react-router-dom";
import { usePreferences } from "../../context/PreferencesContext";

export default function BottomBanner() {
  const navigate = useNavigate();
  const { t } = usePreferences();

  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl bg-forest p-6 sm:p-8 md:grid-cols-[2fr_1fr] md:items-center">
      <div>
        <p className="font-display text-xl text-offwhite sm:text-2xl">
          {t("bottom_banner_headline")}
        </p>
        <p className="mt-1 text-sm text-offwhite/70">
          {t("bottom_banner_subtext")}
        </p>
      </div>

      <div className="rounded-xl bg-forest-deep p-4">
        <p className="text-sm font-medium text-offwhite">{t("bottom_banner_need_change")}</p>
        <p className="mt-1 text-xs text-offwhite/70">
          {t("bottom_banner_update_body")}
        </p>
        <button
          onClick={() => navigate("/onboarding")}
          className="mt-3 rounded-full bg-offwhite px-4 py-2 text-xs font-medium text-forest-deep transition-colors hover:bg-forest-light"
        >
          {t("bottom_banner_update_button")}
        </button>
      </div>
    </div>
  );
}