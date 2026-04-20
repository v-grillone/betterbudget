/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        needs: '#818cf8',
        wants: '#f87171',
        investing: '#34d399',
      },
      fontFamily: {
        sans: ['Montserrat_400Regular'],
        medium: ['Montserrat_500Medium'],
        heading: ['Raleway_700Bold'],
        brand: ['Raleway_300Light'],
      },
    },
  },
  plugins: [],
}
