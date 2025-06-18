/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/nativewind/dist/**/*.js",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#030014",
        seconday: "#151312",
        light: {
          100: "#d6c6ff",
          200: "#a8b5db",
          300: "#9ca4ab",
        },
        dark: {
          100: "#221f3d",
          200: "#0f0d23",
        },
        accent: "#ab8bff",
      },
    },
  },
  plugins: [],
};
