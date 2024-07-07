/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  content: ["./*.html", "./js/*.js", "./*.html.tmpl"],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      fontFamily: {
        "Robot-mono": ['"Robot Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};

