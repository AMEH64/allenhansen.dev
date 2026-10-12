// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import rehypeMermaid from 'rehype-mermaid'
import redirectTrailingSlashes from './integrations/redirect-trailing-slashes.mjs'

const fontDir = './src/assets/fonts'

// https://astro.build/config
export default defineConfig({
  // The apex redirects to www, so canonical, sitemap, and OG URLs use www.
  site: 'https://www.allenhansen.dev',
  integrations: [mdx(), sitemap(), redirectTrailingSlashes()],
  redirects: {
    '/blog': '/notes',
    '/blog/[...slug]': '/notes/[...slug]',
  },
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    // Token colors come from palette-based CSS variables (see src/styles/press.css).
    shikiConfig: { theme: 'css-variables' },
    rehypePlugins: [
      [
        rehypeMermaid,
        {
          strategy: 'img-svg',
          dark: true,
        },
      ],
    ],
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Anybody',
      cssVariable: '--font-anybody',
      fallbacks: ['system-ui', 'sans-serif'],
      optimizedFallbacks: true,
      options: {
        variants: [
          {
            src: [`${fontDir}/anybody-variable.woff2`],
            weight: '400 900',
            stretch: '100% 120%',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Atkinson Hyperlegible Next',
      cssVariable: '--font-atkinson',
      fallbacks: ['system-ui', 'sans-serif'],
      optimizedFallbacks: true,
      options: {
        variants: [
          {
            src: [`${fontDir}/atkinson-hyperlegible-next-variable.woff2`],
            weight: '400 700',
            style: 'normal',
          },
          {
            src: [
              `${fontDir}/atkinson-hyperlegible-next-italic-variable.woff2`,
            ],
            weight: '400 700',
            style: 'italic',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Atkinson Hyperlegible Mono',
      cssVariable: '--font-atkinson-mono',
      fallbacks: ['ui-monospace', 'monospace'],
      optimizedFallbacks: true,
      options: {
        variants: [
          {
            src: [`${fontDir}/atkinson-hyperlegible-mono-variable.woff2`],
            weight: '400 700',
            style: 'normal',
          },
        ],
      },
    },
  ],
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: true } }),
  vite: {
    plugins: [tailwindcss()],
  },
})
