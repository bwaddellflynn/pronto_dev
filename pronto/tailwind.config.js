/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.vue'],
  theme: {
    extend: {
      width: {
        'letter': '1024px', // Custom width for letter size
      }
    }
  },
  plugins: [],
}

