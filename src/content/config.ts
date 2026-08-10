import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    excerpt: z.string(),
    excerptEn: z.string(),
    date: z.date(),
    cover: z.string().optional(),
    /** Base slug of a manim diagram in /public/animations, without the -th/-en suffix. */
    diagram: z.string().optional(),
    diagramCaption: z.string().optional(),
    diagramLabel: z.string().optional(),
  }),
});

export const collections = { blog };
