import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        velvet: {
          950: "#050505",
          900: "#0b0a08",
          850: "#11100d",
          800: "#17140f"
        },
        gold: {
          50: "#fff8dc",
          100: "#ffefad",
          300: "#eecf69",
          400: "#d9b34c",
          500: "#b98a23",
          700: "#72500f"
        },
        champagne: "#f5e8c7",
        ember: "#b75c2b",
        jade: "#4fb79d",
        ruby: "#c84b55"
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"]
      },
      boxShadow: {
        aureate: "0 0 42px rgba(217, 179, 76, 0.18)",
        "inner-gold": "inset 0 0 0 1px rgba(217, 179, 76, 0.22)"
      },
      backgroundImage: {
        "gold-sheen":
          "linear-gradient(135deg, rgba(255,248,220,0.96), rgba(217,179,76,0.88) 42%, rgba(114,80,15,0.94))",
        "noir-radial":
          "radial-gradient(circle at top left, rgba(217,179,76,0.18), transparent 32%), radial-gradient(circle at 80% 0%, rgba(184,92,43,0.12), transparent 28%)"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" }
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-10px)" },
          "40%": { transform: "translateX(10px)" },
          "60%": { transform: "translateX(-7px)" },
          "80%": { transform: "translateX(7px)" }
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(217, 179, 76, 0)" },
          "50%": { boxShadow: "0 0 38px rgba(217, 179, 76, 0.22)" }
        }
      },
      animation: {
        shimmer: "shimmer 4s linear infinite",
        shake: "shake 360ms ease-in-out",
        glow: "glowPulse 2.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
