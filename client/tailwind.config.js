// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Set 'Inter' as the default sans-serif font
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // You can define custom brand colors here if needed
        primary: { // Example using Indigo
          light: '#a5b4fc',
          DEFAULT: '#6366f1',
          dark: '#4338ca',
        },
        // Add other custom colors or override existing ones
      },
      boxShadow: {
         'subtle': '0 4px 12px rgba(0, 0, 0, 0.05)',
         'card': '0 8px 16px rgba(0, 0, 0, 0.07)', // Softer shadow for cards
         'card-hover': '0 12px 24px rgba(0, 0, 0, 0.09)',
      }
    },
  },
  plugins: [],
}