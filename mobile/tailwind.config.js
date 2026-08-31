/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bop: {
          black: "#050505",
          graphite: "#20242A",
          red: "#FF1A1A",
          wine: "#8B0000",
          white: "#F5F5F5",
          silver: "#C7CBD1"
        }
      },
      borderRadius: {
        bop: "8px"
      }
    }
  },
  plugins: []
};
