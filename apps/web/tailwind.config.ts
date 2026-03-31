import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Design System Colors (from HTML)
        "secondary-fixed": "#e9ddff",
        "on-error-container": "#93000a",
        "on-tertiary-fixed": "#29074a",
        "tertiary-fixed": "#efdbff",
        "on-surface": "#131b2e",
        "surface-bright": "#faf8ff",
        "primary-fixed": "#e1e0ff",
        "primary-design": "#393ac8",
        "on-secondary-fixed-variant": "#5516be",
        "inverse-surface": "#283044",
        "on-primary-fixed": "#07006c",
        "secondary-container": "#8455ef",
        "tertiary-fixed-dim": "#dbb8ff",
        "surface-container-high": "#e2e7ff",
        "tertiary": "#614283",
        "secondary-fixed-dim": "#d0bcff",
        "primary-container": "#5356e1",
        "on-primary-container": "#e8e6ff",
        "on-error": "#ffffff",
        "surface-dim": "#d2d9f4",
        "on-tertiary-container": "#f3e2ff",
        "on-secondary": "#ffffff",
        "on-background": "#131b2e",
        "surface-tint": "#494bd6",
        "on-tertiary": "#ffffff",
        "inverse-on-surface": "#eef0ff",
        "surface-container-highest": "#dae2fd",
        "surface-container-lowest": "#ffffff",
        "error-container": "#ffdad6",
        "surface-variant": "#dae2fd",
        "on-secondary-fixed": "#23005c",
        "on-secondary-container": "#fffbff",
        "surface": "#faf8ff",
        "error": "#ba1a1a",
        "outline-variant": "#c7c4d8",
        "outline": "#777587",
        "secondary-design": "#6b38d4",
        "surface-container-low": "#f2f3ff",
        "on-tertiary-fixed-variant": "#573878",
        "on-surface-variant": "#464555",
        "inverse-primary": "#c0c1ff",
        "primary-fixed-dim": "#c0c1ff",
        "on-primary": "#ffffff",
        "tertiary-container": "#7a5a9d",
        "surface-container": "#eaedff",
        "on-primary-fixed-variant": "#2f2ebe",

        // functional shadcn colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        "headline": ["Inter", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
};
export default config;
