/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#D4A017',
          dark: '#1A1209',
          darkAlt: '#24180d',
          light: '#FAF6EE',
          text: '#1A1209',
          muted: '#7B6A58',
          border: '#E8DEC8',
        },
      },
      fontSize: {
        h1: '3.75rem',
        h2: '2.25rem',
        h3: '1.875rem',
        body: '1rem',
        sm: '0.875rem',
      },
    },
  },
  plugins: [],
}
