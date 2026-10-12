// The Vercel adapter turns Astro `redirects` into routes that only match paths without a
// trailing slash, so `/blog/some-note/` (the form the old site linked and canonicalized) would
// 404 instead of redirecting. This runs after the adapter has written its config and lets every
// redirect route match an optional trailing slash.
import { readFile, writeFile } from 'node:fs/promises'

const REDIRECT_STATUSES = new Set([301, 302, 307, 308])

/** @param {{ src?: string, status?: number, headers?: Record<string, string> }} route */
export function allowTrailingSlash(route) {
  if (
    !route.src ||
    !REDIRECT_STATUSES.has(route.status ?? 0) ||
    !route.headers?.Location ||
    !route.src.endsWith('$') ||
    route.src.endsWith('/?$')
  ) {
    return route
  }
  return { ...route, src: `${route.src.slice(0, -1)}/?$` }
}

/** @returns {import('astro').AstroIntegration} */
export default function redirectTrailingSlashes() {
  /** @type {URL} */
  let configFile
  return {
    name: 'redirect-trailing-slashes',
    hooks: {
      'astro:config:done': ({ config }) => {
        configFile = new URL('./.vercel/output/config.json', config.root)
      },
      'astro:build:done': async ({ logger }) => {
        const config = JSON.parse(await readFile(configFile, 'utf8'))
        let changed = 0
        config.routes = config.routes.map(route => {
          const next = allowTrailingSlash(route)
          if (next !== route) changed++
          return next
        })
        await writeFile(configFile, JSON.stringify(config, null, 2))
        logger.info(`${changed} redirect route(s) now accept a trailing slash`)
      },
    },
  }
}
