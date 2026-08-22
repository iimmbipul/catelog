import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Warm cream — matches the logo's background wash */
        ivory: {
          50: "#faf3df",
          100: "#f6ecd5",
          200: "#eddec0",
          300: "#dfc99a",
          400: "#c9a86e",
        },
        /* Deep warm brown scale — used for text and dark surfaces */
        cocoa: {
          50: "#f4ecd8",
          100: "#e6d8b8",
          200: "#c8b696",
          300: "#8f775a",
          400: "#5b4a37",
          500: "#3a2f24",
          600: "#231c15",
          700: "#15100b",
        },
        /* Olive / wreath green — the botanical accent of the logo */
        olive: {
          50: "#eef1e6",
          100: "#dae0c7",
          200: "#b9c497",
          300: "#8fa070",
          400: "#6b7745",
          500: "#4e5730",
        },
        /* Terracotta / rose — a warm accent that plays with cream */
        rose: {
          50: "#fbf3ef",
          100: "#f6e0d5",
          200: "#e9b79f",
          300: "#c88568",
          400: "#a35a3d",
          500: "#7a3d24",
        },
        /* Gold — for ornamental frames, matching the logo's arc */
        gold: {
          100: "#eddec0",
          200: "#d4bd8a",
          300: "#b8985d",
          400: "#8f7442",
        },
        /* Alias: sage was used earlier — keep pointing to olive so old classes still work */
        sage: {
          50: "#eef1e6",
          100: "#dae0c7",
          200: "#b9c497",
          300: "#8fa070",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2.5rem, 6vw, 5.25rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        hero: ["clamp(2rem, 4.4vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        editorial: ["clamp(1.5rem, 2.6vw, 2.4rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      letterSpacing: {
        widish: "0.14em",
        widest2: "0.28em",
      },
      boxShadow: {
        soft: "0 20px 60px -30px rgba(60,44,20,0.25)",
        card: "0 30px 80px -40px rgba(60,44,20,0.32)",
      },
      borderRadius: {
        xl2: "1.75rem",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
