module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "airbnb-base"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["react"],
  rules: {
    eqeqeq: "off",
    curly: "error",
    quotes: ["error", "double"],
    "comma-dangle": ["error", "never"],
    "no-underscore-dangle": ["error", { allow: ["_id"] }]
  }
};
