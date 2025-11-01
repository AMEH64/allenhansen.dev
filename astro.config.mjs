// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import rehypeMermaid from 'rehype-mermaid'

// https://astro.build/config
export default defineConfig({
  site: 'https://allenhansen.dev',
  integrations: [
    mdx({
      rehypePlugins: [rehypeMermaid],
    }),
    sitemap(),
    react(),
  ],
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: true } }),
  vite: {
    plugins: [tailwindcss()],
  },
})
