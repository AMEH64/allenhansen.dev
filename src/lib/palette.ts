import css from '../styles/palette.css?raw'
import { parsePalette } from './color.js'

const tokens = parsePalette(css)

function token(name: string) {
  const value = tokens[name]
  if (!value) {
    throw new Error(
      `palette.css has no "--${name}: light-dark(#…, #…)" line. Generated assets read it from there.`,
    )
  }
  return value
}

/** Source colors from src/styles/palette.css, for assets that can't use CSS variables. */
export const palette = {
  brand: token('brand'),
  paper: token('paper'),
  text: token('text'),
  muted: token('muted'),
  press: token('press'),
}

export type Scheme = 'light' | 'dark'
