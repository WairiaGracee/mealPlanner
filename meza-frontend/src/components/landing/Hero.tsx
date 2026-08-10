import Button from "../ui/Button";
import BackgroundSlideshow from "./BackgroundSlideshow";
import { heroImages } from "../../data/heroImages";
import { useNavigate } from "react-router-dom";
import RegisterPage from "@/pages/RegisterPage";

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden bg-offwhite px-6 pb-16 pt-8 md:px-12 md:pb-24">
      {/* Subtle grain texture, kept very quiet against the light background */}
      <div
        className="pointer-events-none absolute inset-0 bg-grain bg-grain opacity-[0.15]"
        aria-hidden="true"
      />

      <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Text column */}
        <div>
          <h1 className="font-display text-5xl font-medium leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Healthy Kenyan
            <br />
            <span className="italic text-forest">Food, Planned.</span>
          </h1>

          <p className="mt-6 max-w-md font-robotoCondensed text-base text-inkMuted md:text-lg">
            Weekly meal plans built entirely around Kenyan dishes — tailored to
            your body, your goals and your health, with recipes, shopping
            lists, calendar reminders and expert nutrition advice handled
            just for you.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button variant="primary" onClick={()=>navigate("/register")}>Get your first plan</Button>
            <Button variant="outline" onClick={()=>navigate("/about")}>See how it works</Button>
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-forest-light"
            aria-hidden="true"
          />
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-xl sm:aspect-[5/4] lg:aspect-[4/5]">
            <BackgroundSlideshow
              images={heroImages}
              intervalMs={6000}
              variant="fade"
              overlay="none"
            />
          </div>

          {/* Signature stamp badge, now sitting on the photo card corner */}
          <div
            className="absolute -bottom-6 -left-6 hidden h-24 w-24 rotate-6 items-center justify-center rounded-full border border-forest bg-paper text-center font-mono text-[10px] uppercase leading-tight tracking-widest text-forest shadow-lg sm:flex md:h-28 md:w-28 md:text-xs"
            aria-hidden="true"
          >
            Karibu
            <br />
            Est. Nairobi
          </div>
        </div>
      </div>
    </section>
  );
}