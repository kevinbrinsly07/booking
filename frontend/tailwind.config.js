/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-lime': '#C3F73A',
        'dark-purple': '#191919',
        primary: {
          DEFAULT: '#C3F73A',
          50: '#f5ffe6',
          100: '#e8ffc4',
          200: '#d8ff91',
          300: '#C3F73A',
          400: '#b3ed20',
          500: '#9dd310',
          600: '#7db905',
          700: '#5e8f08',
          800: '#4c710d',
          900: '#3f5f10',
        },
        dark: {
          DEFAULT: '#191919',
          50: '#4a3d48',
          100: '#3d3138',
          200: '#2f252c',
          300: '#191919',
          400: '#160c14',
          500: '#0f080d',
          600: '#090509',
          700: '#040204',
          800: '#000000',
          900: '#000000',
        },
      },
    },
  },
  plugins: [],
}
