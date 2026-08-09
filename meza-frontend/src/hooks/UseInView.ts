import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** How much of the element must be visible before it counts as "in view" */
  threshold?: number;
  /** Shrinks the trigger zone vertically so reveals fire a bit before the element hits the very bottom edge */
  rootMargin?: string;
  /** Once true, stop observing — the element won't hide again if scrolled past */
  triggerOnce?: boolean;
}

export function useInView<T extends HTMLElement>({
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  triggerOnce = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Users who've asked the OS for reduced motion just see content
    // immediately, no observer needed.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) observer.unobserve(node);
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, inView };
}