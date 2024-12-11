module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {allowTemplateLiterals: true}],
    "max-len": ["error", {code: 150, ignoreUrls: true}], // Limitar líneas largas excepto URLs
    "comma-dangle": ["error", "always-multiline"], // Asegura comas finales consistentes
    "indent": ["error", 2], // Fuerza indentación de 2 espacios
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {
        "max-len": [
          "error",
          {code: 150, ignoreUrls: true},
        ],
    

      },
    },
  ],
  globals: {},
};
