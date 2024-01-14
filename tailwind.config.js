/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,hbs}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
