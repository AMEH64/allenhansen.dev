import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      // Required: the build fails without these.
      title: z.string().trim().min(1),
      date: z.iso.date(),
      // note: something learned, which can go stale, so it carries a freshness label.
      // story: dated writing that can't go stale; it shows only "Written {Mon D, YYYY}".
      kind: z.enum(['note', 'story']),
      summary: z
        .string()
        .trim()
        .min(1)
        .max(160)
        .regex(/^[^\n]*$/, 'Keep the summary to one line.'),
      tags: z
        .string()
        .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Tags are lowercase-with-dashes.')
        .array()
        .min(1),
      // Optional.
      updatedDate: z.iso.date().optional(),
      image: image().optional(),
      draft: z.boolean().optional().default(false),
      // The change log at the foot of the note, newest first. When it's empty, it's
      // derived from date and updatedDate.
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
            // Links the entry to this commit instead of the file's history.
            commit: z
              .string()
              .regex(
                /^[0-9a-f]{7,40}$/,
                'Use a commit SHA (7 to 40 hex digits).',
              )
              .optional(),
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
    // GitHub-style: Active, Paused, or Archived.
    status: z.enum(['active', 'paused', 'archived']),
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
