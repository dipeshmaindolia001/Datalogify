import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/lessons' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['python', 'sql', 'excel', 'eda', 'statistics', 'projects', 'interview-prep', 'blog', 'python-libraries']),
    order: z.number(),
    phase: z.number().min(1).max(7),
    tags: z.array(z.string()),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    prevSlug: z.string().default(''),
    nextSlug: z.string().default(''),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

const interviewQuestions = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/data/interview-questions' }),
  schema: z.object({
    id: z.string(),
    topic: z.enum(['python', 'sql', 'statistics', 'case-study', 'behavioral', 'take-home']),
    title: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    type: z.string(),
    tags: z.array(z.string()).default([]),
    order: z.number().default(999),
    question: z.string(),
    sampleData: z.string().optional(),
    answer: z.string(),
    explanation: z.string(),
    followUp: z.string().optional(),
    starExample: z.string().optional(),
    framework: z.string().optional(),
  }),
});

export const collections = { lessons, interviewQuestions };
