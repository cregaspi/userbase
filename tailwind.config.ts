import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#20B2AA",
        "primary-hover": "#1A9B93",
        "primary-dark": "#25C5BC",
        ink: "#1A1A1A",
        "ink-muted": "#6B7280",
        canvas: "#ffffff",
        "surface-1": "#F9FAFB",
        "surface-2": "#F3F4F6",
        border: "#E5E7EB",
        "canvas-dark": "#1C1C1C",
        "surface-dark-1": "#252525",
        "surface-dark-2": "#2F2F2F",
        "border-dark": "#3A3A3A",
        "ink-dark": "#F9FAFB",
        "ink-muted-dark": "#9CA3AF",
        "source-card": "#F0FDFC",
        "source-card-dark": "#1A2E2D",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        display: [
          "ui-sans-serif",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "16px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08)",
        elevated: "0 4px 16px rgba(0,0,0,0.1)",
        "elevated-dark": "0 4px 16px rgba(0,0,0,0.4)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "fade-in": "fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-up": "slideUp 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in": "slideIn 300ms cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
