import type { PostMeta } from '~/types/blog/post-meta'

export const getPostMeta = (postMeta: PostMeta) => {
  const { title, description, draft } = postMeta
  return [
    { title },
    { description },
    draft ? { robots: 'noindex' } : null,
  ].filter(Boolean)
}
