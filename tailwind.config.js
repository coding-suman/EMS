/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This ensures Tailwind scans all your React component files for class names
    "./public/index.html"
  ],
  theme: {
    extend: {}, // You can extend the default Tailwind theme here if needed
  },
  plugins: [], // You can add Tailwind plugins here
};
