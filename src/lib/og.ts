import path from 'node:path'
import sharp, { type OverlayOptions } from 'sharp'
import { mix } from './color.js'
import { palette, type Scheme } from './palette'

// Typographic share images, 1200×630: the stock with the lamp parked at its resting angle,
// the logo lockup, the title as an inked impression, and the footer's color bar.
// Colors come from palette.css via ./palette. Fonts are TTF copies of the site's fonts,
// because sharp's text renderer (Pango + fontconfig) can't read woff2.

const W = 1200
const H = 630
const X = 72
const fontDir = path.resolve('src/assets/fonts/og')
const fonts = {
  display: path.join(fontDir, 'anybody.ttf'),
  body: path.join(fontDir, 'atkinson-hyperlegible-next.ttf'),
  mono: path.join(fontDir, 'atkinson-hyperlegible-mono.ttf'),
}

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

async function text(
  markup: string,
  font: string,
  fontfile: string,
  color: string,
  width?: number,
  spacing = 0,
) {
  const { data, info } = await sharp({
    text: {
      text: `<span foreground="${color}">${markup}</span>`,
      font,
      fontfile,
      width,
      rgba: true,
      dpi: 72,
      spacing,
      wrap: 'word',
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}

const backgrounds = new Map<Scheme, Buffer>()
async function background(scheme: Scheme) {
  const cached = backgrounds.get(scheme)
  if (cached) return cached
  const paper = palette.paper[scheme]
  const lamp = scheme === 'dark' ? palette.brand.dark : 'white'
  const lampOpacity = scheme === 'dark' ? 0.09 : 0.5
  const base = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs><radialGradient id="lamp" cx="${W * 0.12}" cy="${H * 0.06}" r="760" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="${lamp}" stop-opacity="${lampOpacity}"/><stop offset="0.7" stop-color="${lamp}" stop-opacity="0"/>
      </radialGradient></defs>
      <rect width="100%" height="100%" fill="${paper}"/>
      <rect width="100%" height="100%" fill="url(#lamp)"/>
    </svg>`,
  )
  const fiber = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <filter id="n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".55 .9" numOctaves="4" seed="4"/>
      <feDiffuseLighting surfaceScale="3.2" diffuseConstant="1.15" lighting-color="white"><feDistantLight azimuth="225" elevation="55"/></feDiffuseLighting></filter>
      <rect width="100%" height="100%" filter="url(#n)" opacity="${scheme === 'dark' ? 0.66 : 0.34}"/>
    </svg>`,
  )
  const buffer = await sharp(base)
    .composite([
      { input: await sharp(fiber).png().toBuffer(), blend: 'soft-light' },
    ])
    .png()
    .toBuffer()
  backgrounds.set(scheme, buffer)
  return buffer
}

export type OgOptions = {
  title: string
  /** The slug line under the logo, e.g. "allenhansen.dev / notes". */
  eyebrow: string
  description?: string
  /** Small mono line at the bottom right, e.g. a post's date. */
  footnote?: string
  /** Page titles print uppercase and wide, like the site's pressed headings. */
  pressed?: boolean
  scheme?: Scheme
}

export async function renderOg({
  title,
  eyebrow,
  description,
  footnote = 'allenhansen.dev',
  pressed = false,
  scheme = 'dark',
}: OgOptions) {
  const ink = palette.text[scheme]
  const muted = palette.muted[scheme]
  const brand = palette.brand[scheme]
  const paper = palette.paper[scheme]
  const highlight = scheme === 'dark' ? mix(ink, paper, 0.18) : 'white'

  const layers: OverlayOptions[] = []

  // logo lockup: the ink square and the wordmark
  const word = await text(
    'ALLEN HANSEN',
    'Anybody ExtraBold 26 @wdth=104',
    fonts.display,
    ink,
  )
  layers.push({
    input: {
      create: { width: 22, height: 22, channels: 4, background: brand },
    },
    top: 64 + Math.round((word.height - 22) / 2),
    left: X,
  })
  layers.push({ input: word.data, top: 64, left: X + 22 + 16 })

  const slug = await text(
    escape(eyebrow.toUpperCase()),
    'Atkinson Hyperlegible Mono 19',
    fonts.mono,
    muted,
    undefined,
    0,
  )
  layers.push({ input: slug.data, top: 120, left: X })

  // title: the largest size that fits in three lines
  const titleText = escape(pressed ? title.toUpperCase() : title)
  const sizes = pressed ? [150, 128, 108, 92, 78] : [92, 80, 68, 58, 50]
  let titleImg = await text(
    titleText,
    `Anybody Heavy ${sizes[0]} @wdth=116`,
    fonts.display,
    ink,
    W - X * 2,
  )
  let titleShadow = { ...titleImg }
  for (const size of sizes) {
    const font = `Anybody ${pressed ? 'Heavy' : 'ExtraBold'} ${size} @wdth=${pressed ? 116 : 112}`
    titleImg = await text(titleText, font, fonts.display, ink, W - X * 2)
    if (titleImg.height <= 270 || size === sizes[sizes.length - 1]) {
      titleShadow = await text(
        titleText,
        font,
        fonts.display,
        highlight,
        W - X * 2,
      )
      break
    }
  }
  const titleTop = 186
  const descGap = pressed ? 28 : 40
  layers.push({ input: titleShadow.data, top: titleTop + 2, left: X + 2 })
  layers.push({ input: titleImg.data, top: titleTop, left: X })

  if (description) {
    let words = description.split(/\s+/)
    let desc = await text(
      escape(words.join(' ')),
      'Atkinson Hyperlegible Next 29',
      fonts.body,
      muted,
      900,
    )
    const maxHeight = Math.max(0, 548 - (titleTop + titleImg.height + descGap))
    while (desc.height > maxHeight && words.length > 4) {
      words = words.slice(0, -1)
      desc = await text(
        `${escape(words.join(' ').replace(/[,.;:]$/, ''))}…`,
        'Atkinson Hyperlegible Next 29',
        fonts.body,
        muted,
        900,
      )
    }
    if (desc.height <= maxHeight) {
      layers.push({
        input: desc.data,
        top: titleTop + titleImg.height + descGap,
        left: X,
      })
    }
  }

  // footer: the color bar from the site footer, and a small note at the right
  const bar = [ink, brand, mix(brand, paper, 0.45), muted]
  bar.forEach((color, i) =>
    layers.push({
      input: {
        create: { width: 40, height: 10, channels: 4, background: color },
      },
      top: 572,
      left: X + i * 40,
    }),
  )
  const foot = await text(
    escape(footnote),
    'Atkinson Hyperlegible Mono 20',
    fonts.mono,
    muted,
  )
  layers.push({ input: foot.data, top: 566, left: W - X - foot.width })

  return sharp(await background(scheme))
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toBuffer()
}
