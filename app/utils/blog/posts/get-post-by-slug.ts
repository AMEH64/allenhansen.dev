import invariant from 'tiny-invariant'
import { postSchema } from '~/types/blog/post'

const allPosts = Object.fromEntries(
  Object.entries(
    import.meta.glob('../../../routes/blog.*/*.mdx', {
      eager: true,
      import: 'handle',
    }),
  ).map(([filePath, postMeta]) => {
    const slug = filePath.split('/').at(-2)?.split('.').at(-1)
    invariant(slug, `Unable to parse slug from file path ${filePath}`)
    return [slug, postSchema.parse(postMeta)]
  }),
)

export const getPostBySlug = (slug: string) => allPosts[slug]
