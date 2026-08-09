import { useState } from "react";
import type { ShowcaseTabId } from "../../types";
import SectionLabel from "../ui/SectionLabel";
import WavyLine from "./wavyLine";
import TwoPhoneMockup from "./TwoPhoneMockup";

interface Tab {
  id: ShowcaseTabId;
  label: string;
  heading: string;
  description: string;
}

const tabs: Tab[] = [
  {
    id: "plan",
    label: "Plan",
    heading: "See your whole week at a glance",
    description:
      "Every day mapped to a Kenyan dish suited to your goals — swap anything with one tap.",
  },
  {
    id: "recipe",
    label: "Recipe",
    heading: "Full recipes, not just names",
    description:
      "Ingredients, steps, and a nutrition breakdown behind every meal on your plan.",
  },
  {
    id: "shop",
    label: "Shop",
    heading: "One list, already sorted",
    description:
      "Every ingredient from your week combined into a single list, grouped the way you'd actually shop.",
  },
  {
    id: "remind",
    label: "Remind",
    heading: "Never miss a prep window",
    description:
      "Synced to Google Calendar with reminders timed to when you actually cook.",
  },
];

export default function TabbedShowcase() {
  const [activeTab, setActiveTab] = useState<ShowcaseTabId>("plan");
  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cream via-cream to-gold/10 px-6 py-20 text-charcoal-deep md:px-12">
      <WavyLine />

      <div className="relative z-10">
        <SectionLabel variant="light">The product, in motion</SectionLabel>

        <div className="mt-8 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="flex flex-wrap gap-2 border-b border-charcoal-deep/10 pb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={activeTab === tab.id}
                  className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay ${
                    activeTab === tab.id
                      ? "bg-charcoal-deep text-cream"
                      : "text-charcoal-deep/50 hover:text-charcoal-deep"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="font-display text-4xl leading-tight text-charcoal-deep md:text-5xl">
                {active.heading}
              </h3>
              <span className="mt-4 block h-1 w-12 rounded-full bg-clay" aria-hidden="true" />
              <p className="mt-4 max-w-md text-base leading-relaxed text-charcoal-deep/70">
                {active.description}
              </p>
            </div>
          </div>

          {/* Stays constant regardless of the active tab — shows the
              landing screen and a dashboard-feel view together, rather
              than swapping content per tab. */}
          <TwoPhoneMockup />
        </div>
      </div>
    </section>
  );
}