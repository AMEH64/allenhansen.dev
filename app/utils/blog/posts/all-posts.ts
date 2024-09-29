import invariant from 'tiny-invariant'
import { postSchema } from '~/types/blog/post'

export const allPosts = Object.fromEntries(
  Object.entries(
    import.meta.glob('../../../routes/blog.*/post.ts', {
      eager: true,
      import: 'default',
    }),
  ).map(([filePath, postMeta]) => {
    const slug = filePath // '../../../routes/blog.hello-world/post.ts'
      .split('/') // [ '..', '..', '..', 'routes', 'blog.hello-world', 'post.ts' ]
      .at(-2) // 'blog.hello-world'
      ?.split('.') // [ 'blog', 'hello-world' ]
      .at(-1) // 'hello-world'
    invariant(slug, `Unable to parse slug from file path ${filePath}`)
    return [slug, postSchema.parse(postMeta)]
  }),
)
