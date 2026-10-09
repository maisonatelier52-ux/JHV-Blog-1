module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A", muted: "#555B66", line: "#D5D9DE",
        shade: { DEFAULT: "#ECEEF1", deep: "#DDE1E6" },
        // The accent: the dark blue of the loading page. It replaces the old black on buttons, dots and the page transition.
        accent: "#12264A",
        // Loading page only
        navy: { 950: "#050A14", 900: "#0A1426", 800: "#0F1D38", 700: "#17294A" },
        greige: "#B9B2A5", // the JHV letters
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
        script: ["var(--font-signature)", "Snell Roundhand", "Apple Chancery", "cursive"],
      },
      keyframes: {
        // The JHV letters are written in from the left; the two lines are drawn out.
        sign: {
          from: { clipPath: "inset(-30% 100% -30% -25%)", opacity: "0.4" },
          to: { clipPath: "inset(-30% -5% -30% -25%)", opacity: "1" },
        },
        draw: { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
      },
      animation: {
        sign: "sign 1.2s cubic-bezier(0.4, 0.1, 0.3, 1) both",
        draw: "draw 0.7s cubic-bezier(0.4, 0, 0.2, 1) both",
      },
    },
  },
  plugins: [],
};
