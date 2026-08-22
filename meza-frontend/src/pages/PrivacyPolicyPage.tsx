import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SectionLabel from "../components/ui/SectionLabel";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-line py-8 first:pt-0 last:border-b-0">
      <h2 className="font-display text-xl text-ink md:text-2xl">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-inkMuted md:text-base">
        {children}
      </div>
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />

      <section className="px-6 pb-8 pt-4 md:px-12">
        <SectionLabel>Privacy policy</SectionLabel>
        <h1 className="mt-4 font-display text-4xl text-ink md:text-5xl">
          Where your data goes, in plain language
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-inkMuted">
          Last updated: 22 August 2026. This explains what Meza collects,
          why, and who it's shared with — including the third parties (like
          Google) that help the app work.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 md:px-12">
        <Section title="1. What we collect">
          <p>
            <strong className="text-ink">Account details</strong> — your
            full name, email address, and a hashed password. If you sign up
            with Google, we instead receive your name, email address and
            profile photo from Google.
          </p>
          <p>
            <strong className="text-ink">Onboarding &amp; profile
            data</strong> — your goal (e.g. weight loss, managing a
            condition), household size, diet style, allergies, cooking time,
            budget, and, if you choose to provide them, your weight and
            height. This is what personalizes your meal plan.
          </p>
          <p>
            <strong className="text-ink">Usage data</strong> — the meal
            plans, recipes and grocery lists generated for you, and which
            ones you view, save or export.
          </p>
        </Section>

        <Section title="2. How we use it">
          <p>
            Your onboarding and profile data is sent to an AI model (Google's
            Gemini API) to generate your personalized weekly Kenyan meal
            plan. We don't use your data to train any AI model ourselves.
          </p>
          <p>
            Your account details are used to authenticate you and keep your
            plan private to your account. We don't sell your personal data
            to advertisers or data brokers.
          </p>
        </Section>

        <Section title="3. Who we share it with">
          <p>
            <strong className="text-ink">Google Sign-In</strong> — if you
            register or log in with Google, Google processes that
            authentication.
          </p>
          <p>
            <strong className="text-ink">Google Gemini API</strong> — your
            onboarding preferences are sent to Gemini to generate meal plan
            content.
          </p>
          <p>
            <strong className="text-ink">Google Calendar</strong> — only if
            you choose to connect it, so meal reminders can be added to your
            own calendar. We don't access your calendar unless you turn this
            on.
          </p>
          <p>
            We don't share your data with any other third party for
            marketing or advertising purposes.
          </p>
        </Section>

        <Section title="4. Cookies">
          <p>
            We use a single httpOnly authentication cookie to keep you
            logged in. It can't be read by JavaScript and isn't used for
            tracking or advertising.
          </p>
        </Section>

        <Section title="5. How long we keep it">
          <p>
            We keep your account and profile data for as long as your
            account is active. If you delete your account, your personal
            data is removed from our active systems; some records may
            persist briefly in backups before they age out.
          </p>
        </Section>

        <Section title="6. Your rights">
          <p>
            You can request a copy of your data, ask us to correct it, or
            ask us to delete your account and associated data at any time by
            contacting us. We aim to respond to any request within a
            reasonable time.
          </p>
        </Section>

        <Section title="7. Children">
          <p>Meza isn't directed at children, and we don't knowingly collect data from anyone under 18.</p>
        </Section>

        <Section title="8. Changes to this policy">
          <p>
            If this policy changes in a meaningful way, we'll update the
            date at the top of this page and, where appropriate, let you
            know directly.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Questions about this policy or your data can be sent to{" "}
            <a href="mailto:privacy@meza.app" className="text-forest underline">
              privacy@meza.app
            </a>
            .
          </p>
        </Section>
      </section>

      <Footer />
    </div>
  );
}