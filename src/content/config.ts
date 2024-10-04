import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z
        .string()
        .date()
        .transform(arg => new Date(arg)),
      updatedDate: z
        .string()
        .date()
        .optional()
        .transform(arg => (arg ? new Date(arg) : undefined)),
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
    summary: z.string().min(1),
    highlights: z.string().min(1).array().min(3).max(7),
    skills: z.string().min(1).array().min(1).optional(),
  }),
})

const educationCollection = defineCollection({
  type: 'data',
  schema: z.object({
    degree: z.string().min(1),
    school: z.string().min(1),
    location: z.string().min(1),
    graduationDate: z.string().date(),
    summary: z.string().min(1),
  }),
})

export const collections = {
  blog,
  jobs: jobsCollection,
  education: educationCollection,
}
