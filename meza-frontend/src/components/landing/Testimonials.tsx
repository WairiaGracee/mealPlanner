import { useState, type FormEvent } from "react";
import { testimonials } from "../../data/testimonials";
import SectionLabel from "../ui/SectionLabel";
import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";
import Avatar from "../ui/Avatar";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 text-gold" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true" className={i < rating ? "" : "text-charcoal-deep/20"}>
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
    <section id="reviews" className="bg-cream px-6 py-20 text-charcoal-deep md:px-12">
      <SectionLabel variant="light">What people are cooking</SectionLabel>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-1">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.id} direction="left" delayMs={i * 120}>
              <div className="flex gap-4 border-t border-charcoal-deep/10 pt-6">
                <Avatar name={t.name} />
                <div>
                  <Stars rating={t.rating} />
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-deep/80">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-wide text-charcoal-deep/50">
                    {t.name} · {t.location}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal
          direction="right"
          className="border-t border-charcoal-deep/10 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
        >
          <h3 className="font-display text-2xl text-charcoal-deep">
            Leave a review
          </h3>

          {submitted ? (
            <p className="mt-4 text-sm text-charcoal-deep/70">
              Thanks — your review has been noted.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
              <div>
                <label htmlFor="rating" className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
                  Your rating
                </label>
                <div className="mt-2 flex gap-2" id="rating">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setRating(value)}
                      aria-label={`Rate ${value} out of 5`}
                      aria-pressed={rating === value}
                      className={`text-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay ${
                        value <= rating ? "text-gold" : "text-charcoal-deep/20"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="review-message" className="font-mono text-xs uppercase tracking-[0.2em] text-clay">
                  Your review
                </label>
                <textarea
                  id="review-message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Tell us how your week of meals went..."
                  className="mt-2 w-full resize-none rounded-lg border border-charcoal-deep/15 bg-white px-4 py-3 text-sm text-charcoal-deep placeholder:text-charcoal-deep/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay"
                />
              </div>

              <Button type="submit" variant="primary" className="self-start">
                Submit review
              </Button>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}