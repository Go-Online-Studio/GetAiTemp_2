import { z } from 'zod';

export const videoSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(2000).optional().default(''),
  prompt: z.string().min(5, 'Prompt must be at least 5 characters'),
  videoUrl: z.string().url('Invalid video URL').or(z.literal('')).optional().default(''),
  videoPublicId: z.string().optional().default(''),
  thumbnailUrl: z.string().url('Invalid thumbnail URL').or(z.literal('')).optional().default(''),
  thumbnailPublicId: z.string().optional().default(''),
  duration: z.coerce.number().min(1).max(3600).default(10),
  category: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  aiTool: z.string().min(1).default('Sora'),
  status: z.enum(['draft', 'published']).default('published'),
  featured: z.boolean().default(false),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens'),
  order: z.coerce.number().default(0),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().optional().default('General Inquiry'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const unlockSchema = z.object({
  videoId: z.string().min(1, 'Video ID is required'),
});

export const viewsSchema = z.object({
  videoId: z.string().min(1, 'Video ID is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
