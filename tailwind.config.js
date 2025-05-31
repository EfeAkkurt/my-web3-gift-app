/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "rgba(255, 255, 255, 0.2)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(236, 72, 153, 0.3)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
