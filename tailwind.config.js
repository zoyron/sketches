/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Pure Monochrome Palette
        'noir': '#000000',
        'deep-black': '#0A0A0A',
        'charcoal': '#1A1A1A',
        'dark-gray': '#2A2A2A',
        'mid-gray': '#606060',
        'light-gray': '#A0A0A0',
        'silver': '#C0C0C0',
        'off-white': '#E8E8E8',
        'pure-white': '#FFFFFF',
      },
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
