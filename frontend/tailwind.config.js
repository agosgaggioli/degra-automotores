/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        backgroundDark: "#071224",
        bluePrimary: "#1f4e96",
        blueSecondary: "#163b71",
        white: "#FFFFFF",
        grayLight: "#f5f7fa",
        grayDark: "#222222",
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
