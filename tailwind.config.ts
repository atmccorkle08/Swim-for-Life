import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary ocean teal
        ocean: {
          DEFAULT: "#0891B2",
          dark: "#0E7490",
          deep: "#155E75",
          light: "#22D3EE",
          50: "#ECFEFF",
          100: "#CFFAFE",
        },
        // Warm coral accent
        coral: {
          DEFAULT: "#F97316",
          light: "#FB923C",
          soft: "#FED7AA",
          dark: "#EA580C",
        },
        // Sand / warm neutrals
        sand: {
          DEFAULT: "#FEF3C7",
          light: "#FFFBEB",
        },
        cream: "#FFF7ED",
        // Light backgrounds
        sky: {
          DEFAULT: "#ECFEFF",
          light: "#F0F9FF",
        },
        // Dark backgrounds
        deep: {
          DEFAULT: "#164E63",
          light: "#1E3A5F",
          darker: "#0C4A6E",
        },
        // Backward-compatible aliases
        primary: {
          DEFAULT: "#0891B2",
          hover: "#0E7490",
        },
        navy: {
          DEFAULT: "#164E63",
          light: "#1E3A5F",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: [
          "var(--font-jakarta)",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
