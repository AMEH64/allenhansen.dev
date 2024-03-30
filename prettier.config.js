/** @type {import("prettier").Config} */
const config = {
  arrowParens: 'avoid',
  proseWrap: 'always',
  semi: false,
  singleQuote: true,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindFunctions: ['classNames'],
}

export default config
