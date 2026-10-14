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

/**
 * Builds the flagged pages that are on. Production already served /about and
 * /now, so a page that's off redirects home instead of 404ing. The redirect is
 * temporary (302) because the page is coming back. static-redirects writes it
 * to dist/_redirects for both /about and /about/ (the URL the old sitemap listed).
 */
export function flaggedPages(): AstroIntegration {
  return {
    name: 'flagged-pages',
    hooks: {
      'astro:config:setup': ({ injectRoute, updateConfig }) => {
        for (const { flag, pattern, entrypoint } of pages) {
          if (features[flag]) injectRoute({ pattern, entrypoint })
        }
        updateConfig({
          redirects: Object.fromEntries(
            pages
              .filter(({ flag }) => !features[flag])
              .map(({ pattern }) => [
                pattern,
                { status: 302, destination: '/' },
              ]),
          ),
        })
      },
    },
  }
}
