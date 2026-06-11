import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const commonSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date(),
  author: z.string(),
  reviewer: z.string(),
  category: z.string(),
  service: z.string(),
  industry: z.string(),
  featuredImage: z.string(),
  sources: z.array(z.string()),
  draft: z.boolean().default(false),
})

const resources = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/resources' }),
  schema: commonSchema,
})

const cases = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/cases' }),
  schema: commonSchema.extend({
    client: z.string(),
    evidenceStatus: z.enum(['verified', 'limited']),
    relatedLinks: z.array(z.string()),
  }),
})

export const collections = { resources, cases }
