import type { APIRoute } from 'astro'
import { SITE_TITLE } from '~/consts'
import { iconUrl } from '~/lib/icons'
import { palette } from '~/lib/palette'

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        name: SITE_TITLE,
        short_name: 'AH',
        icons: [
          {
            src: iconUrl('/icons/icon-192.png'),
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: iconUrl('/icons/icon-512.png'),
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: iconUrl('/icons/icon-maskable-512.png'),
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        theme_color: palette.paper.dark,
        background_color: palette.paper.dark,
        display: 'standalone',
      },
      null,
      2,
    ),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  )
