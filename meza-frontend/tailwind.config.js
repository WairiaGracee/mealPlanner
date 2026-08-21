module.exports = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Personalization: every brand color reads from a CSS custom
        // property (set in index.css) instead of a fixed hex value, so
        // switching `data-theme` on <html> re-skins the whole app
        // without touching a single className. The landing/marketing
        // pages (which don't opt into personalization) just see the
        // "nourish" defaults since that's what :root holds.
        offwhite: "rgb(var(--color-offwhite) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        forest: {
          DEFAULT: "rgb(var(--color-forest) / <alpha-value>)",
          deep: "rgb(var(--color-forest-deep) / <alpha-value>)",
          light: "rgb(var(--color-forest-light) / <alpha-value>)",
        },
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        inkMuted: "rgb(var(--color-ink-muted) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        charcoal: {
          DEFAULT: "rgb(var(--color-charcoal) / <alpha-value>)",
          deep: "rgb(var(--color-charcoal-deep) / <alpha-value>)",
          light: "rgb(var(--color-charcoal-light) / <alpha-value>)",
        },
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        gold: "rgb(var(--color-gold) / <alpha-value>)",
        clay: "rgb(var(--color-clay) / <alpha-value>)",
        sukuma: "rgb(var(--color-sukuma) / <alpha-value>)",
        textLight: "rgb(var(--color-charcoal-light) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ['"Space Mono"', "monospace"],
        robotoCondensed: ['"Roboto Condensed"', "sans-serif"]
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(239,232,218,0.06) 1px, transparent 0)",
        "fruit-pattern": "url('/patterns/fruit-pattern.svg')",
      },
      backgroundSize: {
        grain: "18px 18px",
        "fruit-pattern": "280px 280px",
      },
    },
  },
  plugins: [],
}