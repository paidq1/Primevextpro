/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,ax}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0a0c12', // PrimeVest deep navy background
      }
    },
  },
  plugins: [],
}

