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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />

      <section className="px-6 pb-8 pt-4 md:px-12">
        <SectionLabel>Terms of agreement</SectionLabel>
        <h1 className="mt-4 font-display text-4xl text-ink md:text-5xl">
          The rules for using Meza
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-inkMuted">
          Last updated: 22 August 2026. By creating an account, you're
          agreeing to these terms — please read them alongside our{" "}
          <a href="/privacy" className="text-forest underline">
            Privacy Policy
          </a>
          .
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20 md:px-12">
        <Section title="1. Acceptance of these terms">
          <p>
            By registering for an account, you confirm that you've read and
            agree to these Terms and to our Privacy Policy. If you don't
            agree, please don't create an account.
          </p>
        </Section>

        <Section title="2. What Meza is">
          <p>
            Meza generates personalized, Kenyan-cuisine meal plans, recipes
            and grocery lists based on the information you provide during
            onboarding, using an AI model to help build each plan.
          </p>
        </Section>

        <Section title="3. Not medical advice">
          <p>
            Meza is a meal planning tool, not a medical service. Meal plans,
            recipes and nutrition notes are provided for general informational
            purposes and are not a substitute for advice from a doctor,
            dietitian or other qualified professional — especially if you're
            managing a health condition, pregnant, or have specific dietary
            or medical needs. Always check with a professional before making
            significant changes to your diet.
          </p>
        </Section>

        <Section title="4. Your account">
          <p>
            You're responsible for keeping your login details secure and for
            any activity that happens under your account. Let us know if you
            think your account has been accessed without your permission.
          </p>
          <p>You must be 18 or older to create an account.</p>
        </Section>

        <Section title="5. Acceptable use">
          <p>
            Please don't use Meza to do anything illegal, to attempt to
            access other users' data, or to interfere with how the service
            works for other people.
          </p>
        </Section>

        <Section title="6. Content and AI-generated plans">
          <p>
            Meal plans and recipe content are generated with the help of an
            AI model based on your inputs. We aim for accuracy, but AI-
            generated content can occasionally be wrong — use your judgment,
            particularly around allergies and health conditions.
          </p>
        </Section>

        <Section title="7. Availability">
          <p>
            Meza is provided on an "as available" basis. We may update,
            change or occasionally interrupt the service, including for
            maintenance, without that being a breach of these terms.
          </p>
        </Section>

        <Section title="8. Ending your account">
          <p>
            You can stop using Meza and request account deletion at any
            time. We may suspend or terminate accounts that violate these
            terms.
          </p>
        </Section>

        <Section title="9. Limitation of liability">
          <p>
            To the extent permitted by law, Meza is provided without
            warranties of any kind, and we aren't liable for indirect or
            consequential losses arising from your use of the service.
          </p>
        </Section>

        <Section title="10. Governing law">
          <p>These terms are governed by the laws of Kenya.</p>
        </Section>

        <Section title="11. Changes to these terms">
          <p>
            If these terms change materially, we'll update the date at the
            top of this page and, where appropriate, let you know directly.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>
            Questions about these terms can be sent to{" "}
            <a href="mailto:hello@meza.app" className="text-forest underline">
              hello@meza.app
            </a>
            .
          </p>
        </Section>
      </section>

      <Footer />
    </div>
  );
}