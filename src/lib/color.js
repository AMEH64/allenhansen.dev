// Shared by the site build (src/lib/palette.ts) and scripts/check-contrast.mjs, so the
// favicon, manifest, OG images, and the contrast check all read the same values.

const SOURCE_LINE =
  /--([\w-]+):\s*light-dark\(\s*(#[0-9a-f]{3,8})\s*,\s*(#[0-9a-f]{3,8})\s*\)/gi

/**
 * Reads the source colors out of palette.css: every `--name: light-dark(#light, #dark)`.
 * @param {string} css
 * @returns {Record<string, { light: string, dark: string }>}
 */
export function parsePalette(css) {
  /** @type {Record<string, { light: string, dark: string }>} */
  const tokens = {}
  for (const [, name, light, dark] of css.matchAll(SOURCE_LINE)) {
    tokens[name] = { light: normalizeHex(light), dark: normalizeHex(dark) }
  }
  return tokens
}

/** @param {string} hex */
export function normalizeHex(hex) {
  let h = hex.replace('#', '').toLowerCase()
  if (h.length === 3 || h.length === 4) h = [...h].map(c => c + c).join('')
  return '#' + h.slice(0, 6)
}

/**
 * @param {string} hex
 * @returns {[number, number, number]}
 */
export function hexToRgb(hex) {
  const h = normalizeHex(hex).slice(1)
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16))
}

/** @param {string} hex */
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * WCAG 2 contrast ratio between two opaque colors.
 * @param {string} a
 * @param {string} b
 */
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * Mixes two colors in sRGB, like color-mix(in srgb, a p%, b).
 * @param {string} a
 * @param {string} b
 * @param {number} p share of `a`, 0..1
 */
export function mix(a, b, p) {
  const x = hexToRgb(a)
  const y = hexToRgb(b)
  return (
    '#' +
    x
      .map((v, i) =>
        Math.round(v * p + y[i] * (1 - p))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  )
}
