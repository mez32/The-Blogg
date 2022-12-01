/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      violet: colors.violet,
      yellow: colors.yellow,
      red: colors.red,
      purple: colors.purple,
      // purple: "#5604c8",
      lightPurple: "#5106ba",
      tb_gray: "#b4a8a8",
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
