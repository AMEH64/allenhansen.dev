import { appendFile } from 'node:fs/promises'
import type { AstroConfig, AstroIntegration } from 'astro'

/**
 * Writes the site's `redirects` (from astro.config.mjs and integrations like
 * flagged-pages) to dist/_redirects, which Workers static assets apply before
 * serving any file. Astro's meta-refresh pages are turned off, so the build
 * doesn't ship a 200 page for a URL that should redirect.
 */
export function staticRedirects(): AstroIntegration {
  let redirects: AstroConfig['redirects'] = {}
  return {
    name: 'static-redirects',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({ build: { redirects: false } })
      },
      'astro:config:done': ({ config }) => {
        redirects = config.redirects
      },
      'astro:build:done': async ({ dir }) => {
        const rules = new Set<string>()
        for (const [from, to] of Object.entries(redirects)) {
          if (from.includes('[')) {
            throw new Error(
              `Redirect ${from}: dynamic routes aren't written to _redirects; add the rule to public/_redirects instead.`,
            )
          }
          const { destination, status = 301 } =
            typeof to === 'string' ? { destination: to } : to
          // _redirects matches paths exactly, and links to both forms are out there.
          const bare = from.replace(/(.)\/$/, '$1')
          for (const source of new Set([
            bare,
            bare === '/' ? '/' : `${bare}/`,
          ])) {
            rules.add(`${source} ${destination} ${status}`)
          }
        }
        if (rules.size) {
          await appendFile(
            new URL('_redirects', dir),
            `${[...rules].join('\n')}\n`,
          )
        }
      },
    },
  }
}
