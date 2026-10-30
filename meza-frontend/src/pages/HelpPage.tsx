import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { IconChevronDown, IconHome, IconSearch } from "../components/dashboard/icons";
import { useAuth } from "../context/authContext";

const SUPPORT_EMAIL = "hello@intentionallyWell.app";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How are my meal plans created?",
    a: "intentionallyWell builds a 7-day plan of Kenyan dishes around the answers you gave during onboarding: your goal, household, diet style, allergies, cooking time and budget. Each plan is also checked against WHO healthy-diet guidelines, and you can see how it measures up on the Nutrition page.",
  },
  {
    q: "How do I get a new meal plan?",
    a: "Open Meal Planner and click Regenerate plan. It usually takes a minute or two, and you'll see a progress screen while it works.",
  },
  {
    q: "How do I change my goals, allergies or other preferences?",
    a: "Open Meal Planner and click Edit plan to update your answers, then generate a new plan so the changes take effect.",
  },
  {
    q: "My plan failed to generate. What should I do?",
    a: "The AI service is occasionally busy. Wait a few minutes and try again from Meal Planner. If it keeps failing, email us and mention the message you saw.",
  },
  {
    q: "How does the grocery list work?",
    a: "Grocery List combines every ingredient for your week into one list, grouped by category. Tick items off as you shop.",
  },
  {
    q: "How do I add my meals to Google Calendar?",
    a: "Go to Settings, click Connect Google Calendar, and approve access. Once it's connected, use Sync this week's plan to add grocery and meal-prep reminders to your calendar.",
  },
  {
    q: "Can I download my meal plan or a recipe?",
    a: "Yes. Meal Planner has an Export button for your week, and each recipe page has its own Export menu, so you can save them as an image or a PDF.",
  },
  {
    q: "How do I save recipes I like?",
    a: "Open any recipe and tap Favorite (the heart) or Save (the bookmark). You'll find them under My Collection in the sidebar, in Favorites and Saved Meals.",
  },
  {
    q: "How do I change my name, photo, theme or language?",
    a: "Open the profile menu at the top right for My profile, Personalize and Language. You can also change your name and theme in Settings.",
  },
  {
    q: "How is my information used?",
    a: "Please read our Privacy Policy for the details of what we collect and how it's used.",
  },
];

export default function HelpPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.full_name?.split(" ")[0] ?? "there";
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [query]);

  return (
    <DashboardLayout userName={userName}>
      <div className="mx-auto flex max-w-3xl flex-col gap-5 pt-0">
        <div>
          <nav className="flex items-center gap-2 text-xs text-inkMuted">
            <IconHome className="h-3.5 w-3.5" />
            <button onClick={() => navigate("/dashboard")} className="hover:text-forest">
              Kitchen
            </button>
            <span>/</span>
            <span className="text-ink">Help &amp; Support</span>
          </nav>
          <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Help &amp; Support</h1>
          <p className="mt-1 text-sm text-inkMuted">
            Quick answers about intentionallyWell, and a way to reach us if you need more.
          </p>
        </div>

        <label className="flex items-center gap-3 rounded-full border border-line bg-paper px-5 py-3 text-inkMuted transition-colors focus-within:border-forest">
          <IconSearch className="h-4 w-4 flex-shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help topics..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-inkMuted"
          />
        </label>

        <div className="flex flex-col gap-2">
          {visible.length === 0 ? (
            <p className="rounded-2xl border border-line bg-paper px-5 py-6 text-center text-sm text-inkMuted">
              No topics match "{query}". Try different words, or email us below.
            </p>
          ) : (
            visible.map((f, i) => {
              const open = openIndex === i;
              return (
                <div key={f.q} className="rounded-2xl border border-line bg-paper">
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-medium text-ink">{f.q}</span>
                    <IconChevronDown
                      className={`h-4 w-4 flex-shrink-0 text-inkMuted transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {open && (
                    <p className="px-5 pb-4 text-sm leading-relaxed text-inkMuted">{f.a}</p>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-robotoCondensed text-base font-medium text-ink">
            Still need help?
          </h2>
          <p className="mt-1 text-sm text-inkMuted">
            Email us and tell us what you were doing and any message you saw on screen. That
            helps us fix things faster.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Meza%20support`}
              className="rounded-full bg-forest px-5 py-2.5 text-sm font-medium text-offwhite transition-colors hover:bg-forest-deep"
            >
              Email {SUPPORT_EMAIL}
            </a>
            <button
              onClick={() => navigate("/privacy")}
              className="text-sm text-inkMuted underline transition-colors hover:text-ink"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/terms")}
              className="text-sm text-inkMuted underline transition-colors hover:text-ink"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}