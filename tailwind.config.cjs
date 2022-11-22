/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      purple: "#5604c8",
      gray: "#707070",
    },
    extend: {
      fontFamily: {
        sans: ["Quicksand"],
      },
    },
  },
  plugins: [],
};
