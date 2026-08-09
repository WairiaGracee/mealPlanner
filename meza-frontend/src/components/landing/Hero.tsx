import Button from "../ui/Button";
import BackgroundSlideshow from "./BackgroundSlideshow";
import { heroImages } from "../../data/heroImages";

export default function Hero() {
  return (
    <section className="relative flex min-h-[85vh] flex-col justify-center overflow-hidden px-6 pb-16 pt-8 md:px-12 md:pb-24">
      {/* Rotating background photos + colour overlay, sits behind everything */}
      <BackgroundSlideshow images={heroImages} intervalMs={6000} variant="slide" />

      {/* Subtle grain texture, quiet and disciplined per the design brief */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-grain bg-grain opacity-40"
        aria-hidden="true"
      />

      <div className="relative z-20">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-1.5 w-1.5 rotate-45 bg-clay" aria-hidden="true" />
          <span className="eyebrow">Eat Better. Feel Better. Live Better.</span>
        </div>

        <div className="relative">
          <h1 className="font-display text-[15vw] font-medium leading-[0.9] tracking-tight text-cream sm:text-[10vw] lg:text-[7.5vw]">
            TASTE OF <span className="italic text-gold">HOME</span>
          </h1>

          {/* Signature element: a wax-seal style stamp, standing in for the
              parrot accent in the reference — grounded in local food culture
              instead of an imported motif. */}
          <div
            className="absolute -top-2 right-4 hidden h-24 w-24 rotate-6 items-center justify-center rounded-full border border-gold/70 text-center font-mono text-[10px] uppercase leading-tight tracking-widest text-gold sm:flex md:h-32 md:w-32 md:text-xs"
            aria-hidden="true"
          >
            Karibu
            <br />
            Est. Nairobi
          </div>
        </div>

        <p className="mt-6 max-w-md font-robotoCondensed text-base text-cream/70 md:text-lg">
          Weekly meal plans built entirely around Kenyan dishes — tailored to
          your body, your goals and your health, with recipes, shopping
          lists, calendar reminders and expert nutrition advice handled just for you.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button variant="primary">Get your first plan</Button>
          <Button variant="outline">See how it works</Button>
        </div>
      </div>

      <span
        className="pointer-events-none absolute bottom-0 right-6 z-20 hidden origin-bottom-right -rotate-90 font-mono text-[10px] uppercase tracking-[0.3em] text-muted md:right-12 lg:block"
        aria-hidden="true"
      >
        Scroll for this week&rsquo;s menu
      </span>
    </section>
  );
}