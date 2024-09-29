import { allPosts } from '~/utils/blog/posts/all-posts'

export const getPostBySlug = (slug: string) => allPosts[slug]
