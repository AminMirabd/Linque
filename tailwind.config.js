/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#132E35",
        transparent: "transparent",
        black: "#2c2d2c",
        grayBlue: "#A3B7D2",
        grayHighContranst: "#7C838C",
        grayLowContrast: "#e8e8e8",
      },
      padding: {
        screen: "20px",
      },
      width: {},
      spacing: {
        5: "5px",
        10: "10px",
        15: "15px",
        20: "20px",
        30: "30px",
        40: "40px",
        50: "50px",
        60: "60px",
        70: "70px",
        80: "80px",
        90: "90px",
        100: "100px",
        view: "100vh",
      },
      borderRadius: {
        5: "5px",
        10: "10px",
        20: "20px",
        button: "500px",
      },
    },
  },
  plugins: [],
};
