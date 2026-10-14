import { createHash } from 'node:crypto'
import sharp from 'sharp'
import { palette, type Scheme } from './palette'

// The logo mark as an icon: the header's square of brand ink on a tile of paper. Colors come
// from palette.css via ./palette. The square's edges land on whole pixels at 16, 32, and 48 px.

type Shape = { radius: number; mark: number }
const TILE: Shape = { radius: 6, mark: 20 }
// iOS rounds the corners itself and shows transparency as black, so the tile is full bleed.
const FULL_BLEED: Shape = { radius: 0, mark: 20 }
// Maskable icons get cropped to as little as a circle 80% wide; the square's corners stay inside it.
const MASKABLE: Shape = { radius: 0, mark: 16 }

const shape = ({ radius, mark }: Shape) => {
  const at = (32 - mark) / 2
  return `<rect class="paper" width="32" height="32" rx="${radius}"/><rect class="ink" x="${at}" y="${at}" width="${mark}" height="${mark}"/>`
}
const fills = (scheme: Scheme) =>
  `.paper{fill:${palette.paper[scheme]}}.ink{fill:${palette.brand[scheme]}}`

/** SVG favicon: dark paper by default, light paper when the browser or OS is in light mode. */
export function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><style>${fills('dark')}@media (prefers-color-scheme:light){${fills('light')}}</style>${shape(TILE)}</svg>`
}

export const pngIcons = {
  'apple-touch-icon': { size: 180, shape: FULL_BLEED },
  'icon-192': { size: 192, shape: TILE },
  'icon-512': { size: 512, shape: TILE },
  'icon-maskable-512': { size: 512, shape: MASKABLE },
} as const

/** PNG icon. Raster icons can't follow the color scheme, so they use the dark paper, the site's default. */
export function iconPng(size: number, iconShape: Shape = TILE) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}"><style>${fills('dark')}</style>${shape(iconShape)}</svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

/**
 * Changes whenever the icons do. Browsers keep favicons long after the file changes, so icon
 * URLs carry it (`?v=…`) to make them fetch the new one.
 */
export const iconVersion = createHash('sha256')
  .update(
    [faviconSvg(), ...Object.values(pngIcons).map(i => shape(i.shape))].join(),
  )
  .digest('hex')
  .slice(0, 8)

export const iconUrl = (path: string) => `${path}?v=${iconVersion}`

/** A .ico that wraps PNG images (supported by every current browser). */
export async function faviconIco(sizes = [16, 32, 48]) {
  const images = await Promise.all(sizes.map(s => iconPng(s)))
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)
  let offset = 6 + 16 * images.length
  const entries = images.map((png, i) => {
    const entry = Buffer.alloc(16)
    const size = sizes[i]
    entry.writeUInt8(size >= 256 ? 0 : size, 0)
    entry.writeUInt8(size >= 256 ? 0 : size, 1)
    entry.writeUInt8(0, 2)
    entry.writeUInt8(0, 3)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(png.length, 8)
    entry.writeUInt32LE(offset, 12)
    offset += png.length
    return entry
  })
  return Buffer.concat([header, ...entries, ...images])
}
