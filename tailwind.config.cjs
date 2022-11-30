/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      purple: "#5604c8",
      lightPurple: "#5106ba",
      gray: "#b4a8a8",
      middleGray: "#6a6565",
      darkGray: "#282828",
      darkRed: "#8a1919",
    },
    extend: {
      fontFamily: {
        sans: ["Quicksand"],
      },
    },
  },
  plugins: [],
};
