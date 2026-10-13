import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      draft: z.boolean().optional().default(false),
      pubDate: z.iso.date(),
      updatedDate: z.iso.date().optional(),
      image: image(),
      // Stories and other notes that can't go stale: they read "Written {Mon D, YYYY}" and
      // are never marked out of date.
      timeless: z.boolean().optional().default(false),
      // The change log at the foot of the note, newest first. When it's empty, it's
      // derived from pubDate and updatedDate.
      log: z
        .array(
          z.object({
            date: z.iso.date(),
            kind: z.enum([
              'published',
              'checked',
              'updated',
              'corrected',
              'tweak',
            ]),
            text: z.string().min(1),
          }),
        )
        .optional()
        .default([]),
    }),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    name: z.string().min(1),
    url: z.url().optional(),
    tagline: z.string().min(1),
    status: z.enum(['active', 'paused', 'tinkering', 'idea', 'archived']),
    started: z.string().optional(),
    stack: z.string().array().default([]),
    mark: z.string().min(1),
    order: z.number(),
  }),
})

const jobsCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/jobs' }),
  schema: z.object({
    position: z.string().min(1),
    company: z.string().min(1),
    location: z.string().min(1),
    startDate: z.iso.date(),
    endDate: z.iso.date().optional(),
    highlights: z.string().min(1).array().min(3).max(7),
    skills: z.string().min(1).array().min(1),
  }),
})

const educationCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/education' }),
  schema: z.object({
    degree: z.string().min(1),
    school: z.string().min(1),
    location: z.string().min(1),
    graduationDate: z.iso.date(),
    highlights: z.string().min(1).array().min(1).max(7),
  }),
})

export const collections = {
  blog,
  projects,
  jobs: jobsCollection,
  education: educationCollection,
}
