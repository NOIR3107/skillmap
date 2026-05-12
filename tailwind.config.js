/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./skillmap-ai.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#02040a',
        surface: 'rgba(255,255,255,0.03)',
        primary: '#7c3aed',
        secondary: '#06b6d4',
        accent: '#a855f7',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
