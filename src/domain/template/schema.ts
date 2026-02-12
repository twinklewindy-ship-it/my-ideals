import { z } from 'zod';
import { TemplateResourceBaseUrlSchema } from './imageBaseUrl';

const TemplateLayoutSchema = z.object({
  aspectRatio: z.tuple([z.int(), z.int().min(1)]).optional(),
  columns: z.tuple([z.int(), z.int()]).optional(),
});

const TemplateMember = z.object({
  id: z.string(),
  name: z.string(),
});

const TemplateCollectionItem = z.object({
  id: z.string(),
  member: z.string().or(z.array(z.string()).min(1)),
  name: z.string(),
  image: z.string().optional(),
  rotated: z.boolean().optional(),
});

const TemplateCollection = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional(),
  layout: TemplateLayoutSchema.optional(),
  items: z.array(TemplateCollectionItem),
});

export const TemplateSchema = z.object({
  magic: z.literal('my-ideals-template'),
  version: z.literal(1),
  revision: z.number(),
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  author: z.string().optional(),
  link: z.string().url().optional(), // 修正：z.string().url()
  categories: z.array(z.string()).optional(),
  
  // 修正：统一为 itemUrl，与 types.ts 保持一致
  imageResourceType: z.enum(['itemUrl', 'baseUrl']), 
  
  imageBaseUrl: TemplateResourceBaseUrlSchema.optional(),
  layout: TemplateLayoutSchema.optional(),
  members: z.array(TemplateMember),
  collections: z.array(TemplateCollection),
});
