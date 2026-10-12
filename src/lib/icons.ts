import sharp from 'sharp'
import { palette, type Scheme } from './palette'

// The logo mark as an icon: a square of the brand ink with a small square of paper showing
// through, like the spot on a press sheet. Colors come from palette.css via ./palette.

const shape = (radius: number) =>
  `<rect class="ink" width="32" height="32" rx="${radius}"/><rect class="hole" x="19" y="19" width="7" height="7"/>`

/** SVG favicon that follows the OS color scheme. */
export function faviconSvg() {
  const { brand, paper } = palette
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><style>.ink{fill:${brand.light}}.hole{fill:${paper.light}}@media (prefers-color-scheme:dark){.ink{fill:${brand.dark}}.hole{fill:${paper.dark}}}</style>${shape(3)}</svg>`
}

/** PNG icon at `size` px. Raster icons can't follow the OS scheme, so they use the light-mode ink, which reads on both. */
export function iconPng(
  size: number,
  { radius = 3, scheme = 'light' as Scheme } = {},
) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}"><style>.ink{fill:${palette.brand[scheme]}}.hole{fill:${palette.paper[scheme]}}</style>${shape(radius)}</svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

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
