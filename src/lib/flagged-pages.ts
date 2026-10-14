import { existsSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import type { AstroIntegration } from 'astro'
// Loaded by astro.config.mjs, where the ~ alias doesn't resolve.
import { features } from '../config/features'

/** Pages that only exist while their flag is on. They live outside src/pages/ so Astro doesn't build them unconditionally. */
const pages = [
  {
    flag: 'about',
    pattern: '/about',
    entrypoint: './src/flagged-pages/about.astro',
  },
  { flag: 'now', pattern: '/now', entrypoint: './src/flagged-pages/now.astro' },
] as const

type VercelRoute = { src?: string; status?: number }

/**
 * Builds the flagged pages that are on. Production already served /about and
 * /now, so a page that's off redirects home instead of 404ing. The redirect is
 * temporary (302) because the page is coming back.
 */
export function flaggedPages(): AstroIntegration {
  const off = pages.filter(({ flag }) => !features[flag])
  let root: URL
  return {
    name: 'flagged-pages',
    hooks: {
      'astro:config:setup': ({ config, injectRoute, updateConfig }) => {
        root = config.root
        for (const { flag, pattern, entrypoint } of pages) {
          if (features[flag]) injectRoute({ pattern, entrypoint })
        }
        updateConfig({
          redirects: Object.fromEntries(
            off.map(({ pattern }) => [
              pattern,
              { status: 302, destination: '/' },
            ]),
          ),
        })
      },
      // The Vercel adapter matches redirects exactly, so /about/ (the URL the
      // old sitemap listed) would 404. The adapter's hook runs first, so its
      // routes are already written here.
      'astro:build:done': async () => {
        const file = new URL('.vercel/output/config.json', root)
        if (!off.length || !existsSync(file)) return
        const output = JSON.parse(await readFile(file, 'utf8')) as {
          routes?: VercelRoute[]
        }
        const exact = new Set(off.map(({ pattern }) => `^${pattern}$`))
        for (const route of output.routes ?? []) {
          if (route.status === 302 && route.src && exact.has(route.src)) {
            route.src = route.src.replace(/\$$/, '/?$')
          }
        }
        await writeFile(file, JSON.stringify(output, null, 2))
      },
    },
  }
}
