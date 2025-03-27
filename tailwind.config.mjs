import plugin from 'tailwindcss/plugin'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
    //   supports: {
    //     'field-sizing-content': 'field-sizing: content',
    //     'resize-y': 'resize: vertical',
    //   },
    },
  },
//   plugins: [
//     plugin(({ addVariant, addUtilities, matchUtilities }) => {
//       addVariant('popover-open', '&:popover-open')
//       // https://github.com/tailwindlabs/tailwindcss/pull/13329
//       addVariant('starting', '@starting-style')
//       // https://github.com/tailwindlabs/tailwindcss/pull/12149
//       addUtilities({
//         '.transition-allow-discrete': {
//           'transition-behavior': 'allow-discrete',
//         },
//         '.field-sizing-content': {
//           'field-sizing': 'content',
//         },
//       })
//       matchUtilities({
//         'block-size': value => ({ blockSize: value }),
//         'max-block-size': value => ({ maxBlockSize: value }),
//       })
//     }),
    typography,
  ],
}
