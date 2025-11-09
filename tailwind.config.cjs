// Basic Tailwind config (no DaisyUI)
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color (used as `text-primary`, `bg-primary`, etc.)
        primary: {
          DEFAULT: '#0C2B4E',
          foreground: '#ffffff',
        },
        // Accent color for CTAs and highlights (used as `text-accent`, `bg-accent`)
        accent: {
          DEFAULT: '#F97316',
          foreground: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};
