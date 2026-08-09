module.exports = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        offwhite: "#FAF6EE",
        paper: "#FFFFFF",
        forest: {
          DEFAULT: "#2F4B33",
          deep: "#1E3323",
          light: "#E7EFE3",
        },
        ink: "#22301F",
        inkMuted: "#6B7568",
        line: "#E8E2D3",
        charcoal: {
          DEFAULT: "#12201B",
          deep: "#0D1512",
          light: "#1B2C24",
        },
        cream: "#EFE8DA",
        muted: "#9CA69B",
        gold: "#C79A56",
        clay: "#B65B3D",
        sukuma: "#7A9B5C",
        textLight: "#1B2C24",
      },
      fontFamily: {
        display: ['"Fraunces"', "serif"],
        sans: ['"Inter"', "sans-serif"],
        mono: ['"Space Mono"', "monospace"],
        robotoCondensed: ['"Roboto Condensed"', "sans-serif"]
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(239,232,218,0.06) 1px, transparent 0)",
      },
      backgroundSize: {
        grain: "18px 18px",
      },
    },
  },
  plugins: [],
}


