/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0f1c24",
          900: "#152833",
          700: "#2a4452",
          500: "#4a6b7a",
        },
        fern: {
          700: "#1f5c45",
          600: "#2a7a58",
          500: "#3a9470",
        },
        sand: {
          100: "#e8efe8",
          50: "#f3f7f3",
        },
        clay: {
          600: "#b4532a",
          500: "#c96535",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Source Sans 3", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
