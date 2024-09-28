import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  draft: z.boolean().optional(),
  publishedOn: z.string().datetime(),
  modifiedOn: z.string().datetime().optional(),
})

export type Post = z.infer<typeof postSchema>
