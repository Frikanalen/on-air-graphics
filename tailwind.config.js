/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      "normal-dark": "rgba(255, 255, 255, 0.85)",
      "muted-dark": "rgba(255, 255, 255, 0.7)",
      normal: "rgba(0, 0, 0, 0.85)",
      muted: "rgba(0, 0, 0, 0.7)",
    },
    extend: {},
  },
  plugins: [],
}
