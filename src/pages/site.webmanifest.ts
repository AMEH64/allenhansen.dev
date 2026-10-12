import type { APIRoute } from 'astro'
import { SITE_TITLE } from '~/consts'
import { palette } from '~/lib/palette'

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: SITE_TITLE,
        short_name: 'AH',
        icons: [
          {
            src: '/favicons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        theme_color: palette.brand.light,
        background_color: palette.paper.dark,
        display: 'standalone',
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  )
