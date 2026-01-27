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
      {
        mytheme: {
          "primary": "#65956D",
          "secondary": "#47546B",
          "accent": "#CF9A95",
          "neutral": "#F0EACC",
          "base-100":  "#ffffff",
          "info": "#77A399",
          "success": "#B2CFA5",
          "warning": "#FFD0B0",
          "error": "#E0A096",
        }
      }, // first one is the default theme
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
        nepatriots: {
          "primary": "#002244", // Patriots Navy
          "secondary": "#C60C30", // Patriots Red
          "accent": "#B0B7BC", // Patriots Silver
          "neutral": "#f8f9fa",
          "base-100": "#ffffff",
          "info": "#002244",
          "success": "#28a745",
          "warning": "#ffc107",
          "error": "#dc3545",
        },
        seaseahawks: {
          "primary": "#002244", // Seahawks Navy
          "secondary": "#69BE28", // Seahawks Action Green
          "accent": "#A5ACAF", // Seahawks Wolf Grey
          "neutral": "#f1f3f4",
          "base-100": "#ffffff",
          "info": "#69BE28",
          "success": "#69BE28",
          "warning": "#ff6900",
          "error": "#dc3545",
        },
      }
    ]
  },
  darkMode: ['selector', '[data-theme="dracula"]']
} satisfies Config;
