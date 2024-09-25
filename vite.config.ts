import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import { vercelPreset } from '@vercel/remix/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import contentCollections from '@content-collections/remix-vite'

installGlobals()

export default defineConfig({
  plugins: [
    remix({ presets: [vercelPreset()] }),
    tsconfigPaths(),
    contentCollections(),
  ],
  test: {
    coverage: {
      include: ['app/**'],
    },
    reporters: ['default', 'html'],
  },
})
