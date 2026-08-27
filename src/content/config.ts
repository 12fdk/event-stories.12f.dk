import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().max(120),
    description: z.string().max(200),
    lede: z.string(),
    keyword: z.string(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("Robert Jensen"),
    authorBio: z
      .string()
      .default(
        "Robert Jensen is the developer of Event Stories and has planned his share of celebrations — birthdays, weddings, and a few too-ambitious dinner parties. He built the app because nothing he tried (spreadsheets, notes apps, generic planners) held up once the guest list and budget started moving.",
      ),
    tags: z.array(z.string()).default([]),
    ogImage: z.string().optional(),
    tldr: z.array(z.string()).default([]),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .default([]),
    // Optional HowTo markup for step-based guides. Only set this on posts that
    // genuinely describe an ordered procedure — the steps must correspond to
    // content actually on the page, or the markup is misleading.
    howTo: z
      .object({
        name: z.string(),
        description: z.string(),
        // ISO 8601 duration, e.g. "PT30M" or "P12M".
        totalTime: z.string().optional(),
        steps: z.array(
          z.object({
            name: z.string(),
            text: z.string(),
          }),
        ),
      })
      .optional(),
    relatedSlugs: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };