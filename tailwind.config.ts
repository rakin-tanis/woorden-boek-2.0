import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
      },
      scrollPadding: {
        "24": "6rem",
        "36": "9rem",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        shake2: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
        },
        turnAround: {
          "0%": {
            transform: "rotateY(0deg)",
          },
          "50%": {
            transform: "rotateY(180deg)",
          },
          "100%": {
            transform: "rotateY(0deg)",
          },
        },
        turnAroundAndGreen: {
          "0%": {
            transform: "rotateY(0deg)",
            backgroundColor: "white",
          },
          "50%": {
            transform: "rotateY(180deg)",
            backgroundColor: "white",
          },
          "100%": {
            transform: "rotateY(0deg)",
            backgroundColor: "rgb(34 197 94)",
          },
        },
      },
      animation: {
        shake: "shake 0.5s",
        shake2: "shake2 0.5s ease-in-out",
        pulse: "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        turnAround: "turnAround 0.7s ease-in-out forwards",
        turnAroundAndGreen: "turnAroundAndGreen 0.5s ease-in-out forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;
