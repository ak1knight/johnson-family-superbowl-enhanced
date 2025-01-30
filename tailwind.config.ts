import type { Config } from "tailwindcss";
import daisyui from "daisyui"

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      'nord', // first one is the default theme
      'dracula',
      {
        kcchiefs: {
          "primary": "#E31837",
          "secondary": "#FFB81C",
          "accent": "#000000",
          "neutral": "#ffeacb",
          "base-100": "#ffffff",
        },
        phieagles: {
          "primary": "#004C54",
          "secondary": "#A5ACAF",
          "accent": "#000000",
          "neutral": "#565A5C",
          "base-100": "#ffffff",
        },
      }
    ]
  },
  darkMode: ['selector', '[data-theme="dracula"]']
} satisfies Config;
