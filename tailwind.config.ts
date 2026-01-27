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
      },
      'dracula',
      {
        // AFC EAST
        nepatriots: {
          "primary": "#002244", "secondary": "#C60C30", "accent": "#B0B7BC", "neutral": "#1a1f26", "base-100": "#0d1117", "base-content": "#ffffff"
        },
        miamidolphins: {
          "primary": "#008E97", "secondary": "#FC4C02", "accent": "#005778", "neutral": "#f0f7f8", "base-100": "#e6f7f9", "base-content": "#1a1a1a"
        },
        buffalobills: {
          "primary": "#00338D", "secondary": "#C60C30", "accent": "#ffffff", "neutral": "#e8f0ff", "base-100": "#f0f6ff", "base-content": "#1a1a1a"
        },
        nyjets: {
          "primary": "#125740", "secondary": "#ffffff", "accent": "#32CD32", "neutral": "#e8f4ea", "base-100": "#f0f9f2", "base-content": "#1a1a1a"
        },

        // AFC NORTH
        baltimoreravens: {
          "primary": "#241773", "secondary": "#9E7C0C", "accent": "#ffffff", "neutral": "#1a1f26", "base-100": "#0d1117", "base-content": "#ffffff"
        },
        pittsburghsteelers: {
          "primary": "#FFB612", "secondary": "#000000", "accent": "#C60C30", "neutral": "#1a1c1f", "base-100": "#141618", "base-content": "#ffffff"
        },
        clevelandbrowns: {
          "primary": "#311D00", "secondary": "#FF3C00", "accent": "#ffffff", "neutral": "#1a1f26", "base-100": "#0d1117", "base-content": "#ffffff"
        },
        cincinnatibengals: {
          "primary": "#FB4F14", "secondary": "#000000", "accent": "#ffffff", "neutral": "#1a1c1f", "base-100": "#141618", "base-content": "#ffffff"
        },

        // AFC SOUTH
        indianapoliscolts: {
          "primary": "#002C5F", "secondary": "#A2AAAD", "accent": "#ffffff", "neutral": "#e8ecf0", "base-100": "#f0f4f8", "base-content": "#1a1a1a"
        },
        tennesseetitans: {
          "primary": "#0C2340", "secondary": "#4B92DB", "accent": "#C8102E", "neutral": "#1a1f26", "base-100": "#0d1117", "base-content": "#ffffff"
        },
        houstonTexans: {
          "primary": "#03202F", "secondary": "#A71930", "accent": "#ffffff", "neutral": "#1a1f26", "base-100": "#0d1117", "base-content": "#ffffff"
        },
        jacksonvillejaguars: {
          "primary": "#006778", "secondary": "#9F792C", "accent": "#ffffff", "neutral": "#e8f2f4", "base-100": "#f0f8fa", "base-content": "#1a1a1a"
        },

        // AFC WEST
        kcchiefs: {
          "primary": "#E31837", "secondary": "#FFB81C", "accent": "#ffffff", "neutral": "#fff0e8", "base-100": "#fff8f2", "base-content": "#1a1a1a"
        },
        denverbroncos: {
          "primary": "#FB4F14", "secondary": "#002244", "accent": "#ffffff", "neutral": "#1a1f26", "base-100": "#0d1117", "base-content": "#ffffff"
        },
        lvraiders: {
          "primary": "#000000", "secondary": "#A5ACAF", "accent": "#ffffff", "neutral": "#1a1a1a", "base-100": "#0a0a0a", "base-content": "#ffffff"
        },
        lachargers: {
          "primary": "#0080C6", "secondary": "#FFC20E", "accent": "#ffffff", "neutral": "#e8f4ff", "base-100": "#f0f8ff", "base-content": "#1a1a1a"
        },

        // NFC EAST
        dallascowboys: {
          "primary": "#003594", "secondary": "#041E42", "accent": "#869397", "neutral": "#e8ecf0", "base-100": "#f0f4f8", "base-content": "#1a1a1a"
        },
        phieagles: {
          "primary": "#004C54", "secondary": "#A5ACAF", "accent": "#32CD32", "neutral": "#1a1f26", "base-100": "#0d1117", "base-content": "#ffffff"
        },
        nygiants: {
          "primary": "#0B2265", "secondary": "#A71930", "accent": "#A5ACAF", "neutral": "#e8ecf0", "base-100": "#f0f4f8", "base-content": "#1a1a1a"
        },
        washingtoncommanders: {
          "primary": "#5A1414", "secondary": "#FFB612", "accent": "#ffffff", "neutral": "#1a1f26", "base-100": "#0d1117", "base-content": "#ffffff"
        },

        // NFC NORTH
        greenbaypackers: {
          "primary": "#203731", "secondary": "#FFB612", "accent": "#ffffff", "neutral": "#1a1f26", "base-100": "#0d1117", "base-content": "#ffffff"
        },
        minnesotavikings: {
          "primary": "#4F2683", "secondary": "#FFC62F", "accent": "#ffffff", "neutral": "#f2e8ff", "base-100": "#f8f2ff", "base-content": "#1a1a1a"
        },
        chicagobears: {
          "primary": "#0B162A", "secondary": "#C83803", "accent": "#ffffff", "neutral": "#1a1f26", "base-100": "#0d1117", "base-content": "#ffffff"
        },
        detroitlions: {
          "primary": "#0076B6", "secondary": "#B0B7BC", "accent": "#ffffff", "neutral": "#e8f4ff", "base-100": "#f0f8ff", "base-content": "#1a1a1a"
        },

        // NFC SOUTH
        neworleanssaints: {
          "primary": "#D3BC8D", "secondary": "#101820", "accent": "#ffffff", "neutral": "#f5f2e8", "base-100": "#faf8f0", "base-content": "#1a1a1a"
        },
        tampabaybuccaneers: {
          "primary": "#D50A0A", "secondary": "#FF7900", "accent": "#34302B", "neutral": "#1a1f26", "base-100": "#0d1117", "base-content": "#ffffff"
        },
        atlantafalcons: {
          "primary": "#A71930", "secondary": "#000000", "accent": "#A5ACAF", "neutral": "#1a1c1f", "base-100": "#141618", "base-content": "#ffffff"
        },
        carolinapanthers: {
          "primary": "#0085CA", "secondary": "#101820", "accent": "#BFC0BF", "neutral": "#e8f4ff", "base-100": "#f0f8ff", "base-content": "#1a1a1a"
        },

        // NFC WEST
        seaseahawks: {
          "primary": "#002244", "secondary": "#69BE28", "accent": "#A5ACAF", "neutral": "#1a1f26", "base-100": "#0d1117", "base-content": "#ffffff"
        },
        sf49ers: {
          "primary": "#AA0000", "secondary": "#B3995D", "accent": "#ffffff", "neutral": "#1a1f26", "base-100": "#0d1117", "base-content": "#ffffff"
        },
        larams: {
          "primary": "#003594", "secondary": "#FFA300", "accent": "#FF8200", "neutral": "#e8f0ff", "base-100": "#f0f6ff", "base-content": "#1a1a1a"
        },
        arizonacardinals: {
          "primary": "#97233F", "secondary": "#000000", "accent": "#FFB612", "neutral": "#1a1f26", "base-100": "#0d1117", "base-content": "#ffffff"
        },
      }
    ]
  },
  darkMode: ['selector', '[data-theme="dracula"]']
} satisfies Config;
