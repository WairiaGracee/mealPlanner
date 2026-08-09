import { useEffect, useState } from "react";

interface BackgroundSlideshowProps {
  images: string[];
  /** How long each image stays before transitioning to the next */
  intervalMs?: number;
  /** "fade" crossfades in place; "slide" pushes the new image in from the right */
  variant?: "fade" | "slide";
}

/**
 * Stacks all images on top of each other (absolute + inset-0) and animates
 * between them on an interval — either by crossfading opacity, or by
 * sliding each one horizontally into place.
 */
export default function BackgroundSlideshow({
  images,
  intervalMs = 6000,
  variant = "fade",
}: BackgroundSlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {images.map((src, i) => {
        const isActive = i === index;

        // For "slide", the previous image parks off-screen left as it
        // exits, every other image waits off-screen right, ready to enter.
        const isExitingLeft =
          variant === "slide" &&
          i === (index - 1 + images.length) % images.length;

        const slideTransform = isActive
          ? "translateX(0%)"
          : isExitingLeft
            ? "translateX(-100%)"
            : "translateX(100%)";

        return (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${src})`,
              transitionDuration: "1200ms",
              transitionTimingFunction: "ease-in-out",
              ...(variant === "fade"
                ? {
                    transitionProperty: "opacity, transform",
                    opacity: isActive ? 1 : 0,
                    // Subtle Ken Burns drift on the active slide only
                    transform: isActive ? "scale(1.06)" : "scale(1)",
                  }
                : {
                    transitionProperty: "transform",
                    transform: slideTransform,
                  }),
            }}
          />
        );
      })}

      {/* Colour overlay: darkens + tints the photos so cream/gold text
          stays readable over any image, and ties the photos back into
          the charcoal/gold palette instead of looking pasted-on. */}
      <div className="absolute inset-0 bg-charcoal-deep/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep via-charcoal-deep/30 to-transparent" />
    </div>
  );
}