/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc5fb",
          400: "#36a4f7",
          500: "#0c86eb",
          600: "#0067c8",
          700: "#0153a3",
          800: "#054786",
          900: "#0a3c6f",
        },
      },
    },
  },
  plugins: [],
}
