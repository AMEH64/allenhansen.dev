import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import { vercelPreset } from '@vercel/remix/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import mdx from '@mdx-js/rollup'
import rehypePrettyCode from 'rehype-pretty-code'

installGlobals()

export default defineConfig({
  plugins: [
    mdx({
      // remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      rehypePlugins: [rehypePrettyCode],
    }),
    remix({ presets: [vercelPreset()] }),
    tsconfigPaths(),
  ],
  test: {
    coverage: {
      include: ['app/**'],
    },
    reporters: ['default', 'html'],
  },
})
