/** @type {import('tailwindcss').Config} */
// const url = require("url");
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  mode: 'jit',
  theme: {
    extend: {
      colors:{
        "dark-green": "#3A5B22",
        "dark-grey": "#757575",
        "dark-teal": "#003239",
      },
      content:{
        brandLogo: "url('./assets/rentitall-logo.jpg')",
        loginBg: "url('./assets/login-bg.png')",
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1260px",
      xl: "1700px",
    },
  },
  plugins: [
      require('@tailwindcss/forms'),
  ],
}

