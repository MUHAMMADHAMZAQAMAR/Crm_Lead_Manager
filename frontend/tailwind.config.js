/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // A small, deliberate palette instead of Tailwind's full defaults -
      // this is what keeps the CRM looking cohesive instead of "picked a
      // different blue on every screen."
      colors: {
        ink: "#171B21",       // near-black text, warmer than pure #000
        paper: "#F7F6F3",     // soft off-white background, easy on the eyes
        line: "#E4E1DA",      // hairline borders / dividers
        moss: "#3F6B4F",      // primary accent - a calm, confident green
        "moss-dark": "#2F5139",
        clay: "#B5533C",      // secondary accent for destructive actions
        amber: "#B8862E",     // status: new
        sky: "#3A6EA5",       // status: contacted
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
