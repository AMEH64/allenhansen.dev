// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
  site: 'https://allenhansen.dev',
  integrations: [mdx(), sitemap(), tailwind(), react()],
  output: 'hybrid',
  adapter: vercel({ webAnalytics: { enabled: true } }),
})
