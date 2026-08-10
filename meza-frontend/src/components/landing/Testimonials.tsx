import { useState, type FormEvent } from "react";
import { testimonials } from "../../data/testimonials";
import SectionLabel from "../ui/SectionLabel";
import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";
import Avatar from "../ui/Avatar";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex justify-center gap-1 text-gold" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true" className={i < rating ? "" : "text-ink/15"}>
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: wire to POST /api/reviews once the Django backend is available
    setSubmitted(true);
  }

  return (
    <section id="reviews" className="bg-offwhite px-6 py-20 text-ink md:px-12">
      {/* Centered intro, matching the reference's "Our Passionate Team" framing */}
      <div className="text-center">
        <SectionLabel variant="light" className="justify-center">
          What people are cooking
        </SectionLabel>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-inkMuted">
          Real weeks, real plates, real feedback — a few notes from people
          who've handed their weekly cooking over to intentionallyWell.
        </p>
      </div>

      {/* Reviewer row — ringed circular photos, caps name, location as the role line */}
      <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3">
        {testimonials.map((t, i) => (
          <ScrollReveal key={t.id} delayMs={i * 120}>
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full border-2 border-forest/30 p-1.5">
                <Avatar name={t.name} className="h-24 w-24 text-lg" />
              </div>

              <Stars rating={t.rating} />

              <p className="mt-4 max-w-xs text-sm leading-relaxed text-inkMuted">
                &ldquo;{t.quote}&rdquo;
              </p>

              <p className="mt-5 font-robotoCondensed text-base font-bold uppercase tracking-[0.08em] text-ink">
                {t.name}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-inkMuted/70">
                {t.location}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Review form — kept as its own centered block below the reviewer row */}
      <ScrollReveal className="mx-auto mt-20 max-w-lg border-t border-ink/10 pt-10 text-center">
        <h3 className="font-display text-2xl text-ink">Leave a review</h3>

        {submitted ? (
          <p className="mt-4 text-sm text-inkMuted">
            Thanks — your review has been noted.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col items-center gap-4">
            <div>
              <label htmlFor="rating" className="font-mono text-xs uppercase tracking-[0.2em] text-forest">
                Your rating
              </label>
              <div className="mt-2 flex justify-center gap-2" id="rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setRating(value)}
                    aria-label={`Rate ${value} out of 5`}
                    aria-pressed={rating === value}
                    className={`text-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest ${
                      value <= rating ? "text-gold" : "text-ink/15"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full">
              <label htmlFor="review-message" className="font-mono text-xs uppercase tracking-[0.2em] text-forest">
                Your review
              </label>
              <textarea
                id="review-message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Tell us how your week of meals went..."
                className="mt-2 w-full resize-none rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-inkMuted focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest"
              />
            </div>

            <Button type="submit" variant="primary">
              Submit review
            </Button>
          </form>
        )}
      </ScrollReveal>
    </section>
  );
}