/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#9400D3", // Vivid purple
          light: "#B14DFF",
          dark: "#7B00AD",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#CCFF00", // Electric lemon green
          light: "#E0FF4D",
          dark: "#A8CC00",
          foreground: "#000000",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(148, 0, 211, 0.2)",
        "glow-green": "0 0 20px rgba(204, 255, 0, 0.2)",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        slideUp: "slideUp 0.3s ease-out",
        fadeIn: "fadeIn 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

