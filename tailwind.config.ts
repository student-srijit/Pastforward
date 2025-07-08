import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
        // Instagram-like theme colors
        instagram: {
          blue: "#405DE6",
          purple: "#5B51D8",
          purple2: "#833AB4",
          pink: "#C13584",
          pink2: "#E1306C",
          red: "#FD1D1D",
          orange: "#F77737",
          yellow: "#FCAF45",
          yellow2: "#FFDC80",
        },
        // Twitter-like dark theme
        twitter: {
          black: "#15202B",
          darkBlue: "#192734",
          blue: "#1DA1F2",
          gray: "#8899A6",
          lightGray: "#AAB8C2",
        },
        // Updated timeline colors with Instagram theme
        timeline: {
          50: "#F5F0FF",
          100: "#EDE6FF",
          200: "#D7C3FE",
          300: "#C1A1FC",
          400: "#A97EFA",
          500: "#E1306C", // Instagram pink
          600: "#833AB4", // Instagram purple
          700: "#405DE6", // Instagram blue
          800: "#FD1D1D", // Instagram red
          900: "#F77737", // Instagram orange
        },
        era: {
          50: "#F0F7FF",
          100: "#E6F0FF",
          200: "#C3DFFF",
          300: "#A1CDFF",
          400: "#7EB9FF",
          500: "#5CA4FF",
          600: "#3990FF",
          700: "#177BFF",
          800: "#0862D3",
          900: "#0752B1",
        },
        vintage: {
          50: "#F5F0FF",
          100: "#EDE6FF",
          200: "#D7C3FE",
          300: "#C1A1FC",
          400: "#A97EFA",
          500: "#925CF8",
          600: "#7A39F6",
          700: "#6217F4",
          800: "#4F08D3",
          900: "#4207B1",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "glass-shatter": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "5%": { opacity: "0.9", transform: "scale(0.98)" },
          "10%": { opacity: "1", transform: "scale(1)" },
          "20%": { opacity: "0", transform: "scale(1.5)" },
          "100%": { opacity: "0", transform: "scale(2)" },
        },
        "text-gradient": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(225, 48, 108, 0.5)" },
          "50%": { opacity: "0.7", boxShadow: "0 0 40px rgba(225, 48, 108, 0.8)" },
        },
        "rotate-3d": {
          "0%": { transform: "rotateY(0deg) rotateX(0deg)" },
          "50%": { transform: "rotateY(180deg) rotateX(10deg)" },
          "100%": { transform: "rotateY(360deg) rotateX(0deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin-slow 6s linear infinite",
        "glass-shatter": "glass-shatter 1s forwards",
        "text-gradient": "text-gradient 3s ease infinite",
        "bounce-slow": "bounce-slow 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "rotate-3d": "rotate-3d 15s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
