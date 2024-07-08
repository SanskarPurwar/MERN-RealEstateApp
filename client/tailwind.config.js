/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize:{
        'xxs' : ['0.65rem' , '0.75rem'],
      },
      screens:{
        'xxs' : '220px',
        'xs' : '400px',
      }
    },
  },
  plugins: [],
}