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
          "primary": "#002244", "secondary": "#C60C30", "accent": "#B0B7BC", "neutral": "#f0f2f5", "base-100": "#f8f9fb", "base-content": "#1a1a1a"
        },
        miamidolphins: {
          "primary": "#008E97", "secondary": "#FC4C02", "accent": "#005778", "neutral": "#f0f9fa", "base-100": "#f5fdfb", "base-content": "#1a1a1a"
        },
        buffalobills: {
          "primary": "#00338D", "secondary": "#C60C30", "accent": "#ffffff", "neutral": "#f0f4ff", "base-100": "#f8faff", "base-content": "#1a1a1a"
        },
        nyjets: {
          "primary": "#125740", "secondary": "#ffffff", "accent": "#32CD32", "neutral": "#f0f7f2", "base-100": "#f8fbf9", "base-content": "#1a1a1a"
        },

        // AFC NORTH
        baltimoreravens: {
          "primary": "#241773", "secondary": "#9E7C0C", "accent": "#ffffff", "neutral": "#f2f0f8", "base-100": "#f9f8fc", "base-content": "#1a1a1a"
        },
        pittsburghsteelers: {
          "primary": "#FFB612", "secondary": "#000000", "accent": "#C60C30", "neutral": "#fffbf0", "base-100": "#fffdfa", "base-content": "#1a1a1a"
        },
        clevelandbrowns: {
          "primary": "#311D00", "secondary": "#FF3C00", "accent": "#ffffff", "neutral": "#f5f3f0", "base-100": "#faf9f8", "base-content": "#1a1a1a"
        },
        cincinnatibengals: {
          "primary": "#FB4F14", "secondary": "#000000", "accent": "#ffffff", "neutral": "#fff2f0", "base-100": "#fff9f8", "base-content": "#1a1a1a"
        },

        // AFC SOUTH
        indianapoliscolts: {
          "primary": "#002C5F", "secondary": "#A2AAAD", "accent": "#ffffff", "neutral": "#f0f2f5", "base-100": "#f8f9fb", "base-content": "#1a1a1a"
        },
        tennesseetitans: {
          "primary": "#0C2340", "secondary": "#4B92DB", "accent": "#C8102E", "neutral": "#f0f4ff", "base-100": "#f8faff", "base-content": "#1a1a1a"
        },
        houstontexans: {
          "primary": "#03202F", "secondary": "#A71930", "accent": "#ffffff", "neutral": "#f0f2f4", "base-100": "#f8f9fa", "base-content": "#1a1a1a"
        },
        jacksonvillejaguars: {
          "primary": "#006778", "secondary": "#9F792C", "accent": "#ffffff", "neutral": "#f0f7f8", "base-100": "#f8fbfc", "base-content": "#1a1a1a"
        },

        // AFC WEST
        kcchiefs: {
          "primary": "#E31837", "secondary": "#FFB81C", "accent": "#ffffff", "neutral": "#fff5f0", "base-100": "#fffafa", "base-content": "#1a1a1a"
        },
        denverbroncos: {
          "primary": "#FB4F14", "secondary": "#002244", "accent": "#ffffff", "neutral": "#fff2f0", "base-100": "#fff9f8", "base-content": "#1a1a1a"
        },
        lvraiders: {
          "primary": "#000000", "secondary": "#A5ACAF", "accent": "#ffffff", "neutral": "#f5f5f5", "base-100": "#fafafa", "base-content": "#1a1a1a"
        },
        lachargers: {
          "primary": "#0080C6", "secondary": "#FFC20E", "accent": "#ffffff", "neutral": "#f0f6ff", "base-100": "#f8fbff", "base-content": "#1a1a1a"
        },

        // NFC EAST
        dallascowboys: {
          "primary": "#003594", "secondary": "#041E42", "accent": "#869397", "neutral": "#f0f4ff", "base-100": "#f8faff", "base-content": "#1a1a1a"
        },
        phieagles: {
          "primary": "#004C54", "secondary": "#A5ACAF", "accent": "#32CD32", "neutral": "#f0f7f8", "base-100": "#f8fbfc", "base-content": "#1a1a1a"
        },
        nygiants: {
          "primary": "#0B2265", "secondary": "#A71930", "accent": "#A5ACAF", "neutral": "#f0f2f8", "base-100": "#f8f9fc", "base-content": "#1a1a1a"
        },
        washingtoncommanders: {
          "primary": "#5A1414", "secondary": "#FFB612", "accent": "#ffffff", "neutral": "#f5f2f2", "base-100": "#faf9f9", "base-content": "#1a1a1a"
        },

        // NFC NORTH
        greenbaypackers: {
          "primary": "#203731", "secondary": "#FFB612", "accent": "#ffffff", "neutral": "#f2f5f3", "base-100": "#f9fafa", "base-content": "#1a1a1a"
        },
        minnesotavikings: {
          "primary": "#4F2683", "secondary": "#FFC62F", "accent": "#ffffff", "neutral": "#f5f2f8", "base-100": "#faf9fc", "base-content": "#1a1a1a"
        },
        chicagobears: {
          "primary": "#0B162A", "secondary": "#C83803", "accent": "#ffffff", "neutral": "#f0f2f4", "base-100": "#f8f9fa", "base-content": "#1a1a1a"
        },
        detroitlions: {
          "primary": "#0076B6", "secondary": "#B0B7BC", "accent": "#ffffff", "neutral": "#f0f6ff", "base-100": "#f8fbff", "base-content": "#1a1a1a"
        },

        // NFC SOUTH
        neworleanssaints: {
          "primary": "#D3BC8D", "secondary": "#101820", "accent": "#ffffff", "neutral": "#f8f6f2", "base-100": "#fcfbf9", "base-content": "#1a1a1a"
        },
        tampabaybuccaneers: {
          "primary": "#D50A0A", "secondary": "#FF7900", "accent": "#34302B", "neutral": "#fff0f0", "base-100": "#fff8f8", "base-content": "#1a1a1a"
        },
        atlantafalcons: {
          "primary": "#A71930", "secondary": "#000000", "accent": "#A5ACAF", "neutral": "#f5f2f3", "base-100": "#faf9f9", "base-content": "#1a1a1a"
        },
        carolinapanthers: {
          "primary": "#0085CA", "secondary": "#101820", "accent": "#BFC0BF", "neutral": "#f0f6ff", "base-100": "#f8fbff", "base-content": "#1a1a1a"
        },

        // NFC WEST
        seaseahawks: {
          "primary": "#002244", "secondary": "#69BE28", "accent": "#A5ACAF", "neutral": "#f0f2f5", "base-100": "#f8f9fb", "base-content": "#1a1a1a"
        },
        sf49ers: {
          "primary": "#AA0000", "secondary": "#B3995D", "accent": "#ffffff", "neutral": "#f5f0f0", "base-100": "#faf8f8", "base-content": "#1a1a1a"
        },
        larams: {
          "primary": "#003594", "secondary": "#FFA300", "accent": "#FF8200", "neutral": "#f0f4ff", "base-100": "#f8faff", "base-content": "#1a1a1a"
        },
        arizonacardinals: {
          "primary": "#97233F", "secondary": "#000000", "accent": "#FFB612", "neutral": "#f5f2f3", "base-100": "#faf9f9", "base-content": "#1a1a1a"
        },
      }
    ]
  },
  darkMode: ['selector', '[data-theme="dracula"]']
} satisfies Config;
