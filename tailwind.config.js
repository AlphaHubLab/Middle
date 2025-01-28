/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx"],
  theme: {
    extend: {
      colors: {
        fetch: {
          // black: "#27272a",
          black: "#000",
          primary: "#380088",
          secondary: "#e3e3ff",
          darkgray: "#4b5563",
          lightgray: "#f4f4f5"
        }
      }
    }
  },
  plugins: []
}
