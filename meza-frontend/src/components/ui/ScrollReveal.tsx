import type { ReactNode } from "react";
import { useInView } from "../../hooks/UseInView";

type Direction = "up" | "left" | "right";

interface ScrollRevealProps {
  children: ReactNode;
  /** Which direction the content slides in from */
  direction?: Direction;
  /** Stagger reveals within a group, e.g. delayMs={i * 100} in a .map() */
  delayMs?: number;
  className?: string;
}

const hiddenOffset: Record<Direction, string> = {
  up: "translate-y-8",
  left: "-translate-x-8",
  right: "translate-x-8",
};

export default function ScrollReveal({
  children,
  direction = "up",
  delayMs = 0,
  className = "",
}: ScrollRevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView
          ? "translate-x-0 translate-y-0 opacity-100"
          : `opacity-0 ${hiddenOffset[direction]}`
      } ${className}`}
      style={{ transitionDelay: inView ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}