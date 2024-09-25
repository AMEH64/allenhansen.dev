import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { promisify } from 'node:util'
import child_process from 'node:child_process'

const exec = promisify(child_process.exec)

const posts = defineCollection({
  name: 'posts',
  directory: 'app/content/posts',
  include: '**/*.mdx',
  schema: z => ({
    title: z.string(),
    summary: z.string(),
  }),
  transform: async (document, context) => {
    const publishedOn = await context.cache(
      document._meta.filePath,
      async filePath => {
        const { stdout } = await exec(
          `git log --follow --reverse --format=%ai --date iso-strict -- ${filePath} | head -1`,
        )
        return stdout
          ? new Date(stdout.trim()).toISOString()
          : new Date().toISOString()
      },
    )
    const lastModifiedOn = await context.cache(
      document._meta.filePath,
      async filePath => {
        const { stdout } = await exec(
          `git log -1 --follow --format=%ai --date iso-strict -- ${filePath} | head -1`,
        )
        return stdout
          ? new Date(stdout.trim()).toISOString()
          : new Date().toISOString()
      },
    )

    const mdx = await compileMDX(context, document)

    return {
      ...document,
      publishedOn,
      lastModifiedOn,
      mdx,
    }
  },
})

export default defineConfig({
  collections: [posts],
})
