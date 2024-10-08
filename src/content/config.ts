import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      draft: z.boolean().optional().default(false),
      pubDate: z.string().date(),
      updatedDate: z.string().date().optional(),
      image: image().refine(img => img.width >= 1080, {
        message: 'Cover image must be at least 1080 pixels wide!',
      }),
    }),
})

const jobsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    position: z.string().min(1),
    company: z.string().min(1),
    location: z.string().min(1),
    startDate: z.string().date(),
    endDate: z.string().date().optional(),
    highlights: z.string().min(1).array().min(3).max(7),
    skills: z.string().min(1).array().min(1),
  }),
})

const educationCollection = defineCollection({
  type: 'data',
  schema: z.object({
    degree: z.string().min(1),
    school: z.string().min(1),
    location: z.string().min(1),
    graduationDate: z.string().date(),
    highlights: z.string().min(1).array().min(1).max(7),
  }),
})

export const collections = {
  blog,
  jobs: jobsCollection,
  education: educationCollection,
}
