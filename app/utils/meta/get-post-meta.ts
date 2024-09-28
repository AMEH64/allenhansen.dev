import type { Post } from '~/types/blog/post'

export const getPostMeta = (post: Post) => {
  const { title, description, draft } = post
  return [
    { title },
    { description },
    draft ? { robots: 'noindex' } : null,
  ].filter(Boolean)
}
