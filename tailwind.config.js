/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw",
  content: ["./*.html", "./js/*.js", "./*.html.tmpl"],
  theme: {
    container: {
      padding: {
        DEFAULT: "0rem",
        sm: "0.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
      },
    },
    extend: {
      fontFamily: {
        "Roboto-mono": ['"Roboto Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
// npx @tailwindcss/cli -c tailwind.config.js -i ./tailwind.css -o ./build.css --minify
