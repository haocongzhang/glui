module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    "plugin:react/recommended",
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/display-name": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "quotes": ["error", "single"],
  }
}
