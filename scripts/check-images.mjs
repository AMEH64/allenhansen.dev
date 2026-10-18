// Fails if a committed image or a built one carries EXIF (and so GPS), XMP, IPTC, ICC, or text
// metadata, or if dist/ serves a raster image that isn't WebP outside the exceptions below.
// Runs after every build; run it on its own with `pnpm check:images` after `pnpm build`.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { extname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = fileURLToPath(new URL('..', import.meta.url))
const RASTER = [
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.avif',
  '.tif',
  '.tiff',
  '.ico',
]
// Icons stay PNG and ICO for browsers and home screens, and OG images stay PNG for crawlers
// that don't read WebP.
const NOT_WEBP_OK = [/^favicon\.ico$/, /^icons\//, /^og\//]

function* images(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* images(path)
    else if (RASTER.includes(extname(entry.name).toLowerCase())) yield path
  }
}

// An .ico here wraps PNGs (see src/lib/icons.ts); sharp reads each one.
function icoEntries(buf) {
  return Array.from({ length: buf.readUInt16LE(4) }, (_, i) => {
    const size = buf.readUInt32LE(6 + 16 * i + 8)
    const offset = buf.readUInt32LE(6 + 16 * i + 12)
    return buf.subarray(offset, offset + size)
  })
}

async function metadataIn(file) {
  const buf = readFileSync(file)
  const found = new Set()
  for (const part of extname(file) === '.ico' ? icoEntries(buf) : [buf]) {
    const m = await sharp(part).metadata()
    if (m.exif) found.add('EXIF')
    if (m.xmp) found.add('XMP')
    if (m.iptc) found.add('IPTC')
    if (m.icc) found.add('ICC')
    if (m.comments?.length) found.add('text')
  }
  return [...found]
}

const problems = []
let sources = 0
for (const dir of ['src', 'public']) {
  for (const file of images(join(root, dir))) {
    sources++
    const found = await metadataIn(file)
    if (found.length)
      problems.push(`${relative(root, file)} has ${found.join(', ')} metadata.`)
  }
}

const dist = join(root, 'dist')
let built = 0
if (existsSync(dist)) {
  for (const file of images(dist)) {
    built++
    const path = relative(dist, file).split(sep).join('/')
    if (
      extname(file).toLowerCase() !== '.webp' &&
      !NOT_WEBP_OK.some(re => re.test(path))
    )
      problems.push(
        `dist/${path} isn't WebP. Render it with <Image> or commit it as WebP.`,
      )
    const found = await metadataIn(file)
    if (found.length)
      problems.push(`dist/${path} has ${found.join(', ')} metadata.`)
  }
} else {
  console.log(
    'check-images: no dist/ yet, so only committed images were checked.',
  )
}

if (problems.length) {
  console.error(problems.map(p => `FAIL  ${p}`).join('\n'))
  console.error(
    '\ncheck-images: strip metadata from committed images, e.g. with `exiftool -all= <file>` (convert a photo with a non-sRGB profile to sRGB first, or its colors shift). Built images get their metadata from the committed file or from the code that draws them.',
  )
  process.exit(1)
}
console.log(
  `check-images: ${sources} committed and ${built} built images carry no metadata, and every built raster outside icons and OG images is WebP.`,
)
