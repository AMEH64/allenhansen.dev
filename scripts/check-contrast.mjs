// Fails if the brand ink, body text, or muted text drops below WCAG AA on either paper.
// Runs before every build; run it on its own with `pnpm check:contrast`.
import { readFileSync } from 'node:fs'
import { contrast, parsePalette } from '../src/lib/color.js'

const AA = 4.5
const css = readFileSync(
  new URL('../src/styles/palette.css', import.meta.url),
  'utf8',
)
const tokens = parsePalette(css)

const pairs = [
  ['brand', 'paper'],
  ['text', 'paper'],
  ['muted', 'paper'],
  ['brand', 'surface'],
  ['muted', 'surface'],
  ['text', 'press'],
  ['brand', 'press'],
]

let failed = false
const rows = []
for (const [fg, bg] of pairs) {
  for (const scheme of /** @type {const} */ (['light', 'dark'])) {
    const a = tokens[fg]?.[scheme]
    const b = tokens[bg]?.[scheme]
    if (!a || !b) {
      console.error(
        `check-contrast: --${!a ? fg : bg} is missing from palette.css (expected "light-dark(#…, #…)").`,
      )
      process.exit(1)
    }
    const ratio = contrast(a, b)
    const ok = ratio >= AA
    if (!ok) failed = true
    rows.push(
      `${ok ? 'pass' : 'FAIL'}  ${scheme.padEnd(5)}  --${fg} ${a} on --${bg} ${b}  ${ratio.toFixed(2)}:1`,
    )
  }
}

console.log(rows.join('\n'))
if (failed) {
  console.error(
    `\ncheck-contrast: at least one pair is below ${AA}:1. Adjust the light or dark value in src/styles/palette.css.`,
  )
  process.exit(1)
}
console.log(`\ncheck-contrast: every pair meets WCAG AA (${AA}:1).`)
