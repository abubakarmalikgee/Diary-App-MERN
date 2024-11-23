/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFA500", // Orange
        secondary: "#FFFFFF", // White
      },
    },
  },
  plugins: [require("daisyui")],

  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#FFA500", // Orange
          secondary: "#FFFFFF", // White
        },
      },
    ],
  },
};
