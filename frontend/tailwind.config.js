/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["DM Sans",  "system-ui", "sans-serif"],
        display: ["Sora",     "system-ui", "sans-serif"],
      },
      colors: {
        // Paleta principal AccessSim
        navy: {
          950: "#060d18",
          900: "#0d1b2a",
          800: "#132338",
          700: "#1a2f4a",
          600: "#1e3a5f",
        },
        brand: {
          300: "#fb923c",
          400: "#f97316",
          500: "#ea580c",
          600: "#c2410c",
        },
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Glow pulsante no hero
        glow: {
          "0%, 100%": { opacity: "0.4" },
          "50%":      { opacity: "0.8" },
        },
      },
      animation: {
        "fade-up":   "fadeUp 0.6s ease both",
        "fade-up-1": "fadeUp 0.6s 0.1s ease both",
        "fade-up-2": "fadeUp 0.6s 0.2s ease both",
        "fade-up-3": "fadeUp 0.6s 0.3s ease both",
        glow:        "glow 3s ease infinite",
      },
    },
  },
  plugins: [],
};
