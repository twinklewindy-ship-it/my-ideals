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

// --- 给合集添加 category 字段 ---
const TemplateCollection = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().optional(), // 新增
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
  link: z.string().url().optional(), 
  
  // --- 给模板添加 categories 列表 ---
  categories: z.array(z.string()).optional(), // 新增

  imageResourceType: z.enum(['inline', 'baseUrl']),
  imageBaseUrl: TemplateResourceBaseUrlSchema.optional(),
  layout: TemplateLayoutSchema.optional(),
  members: z.array(TemplateMember),
  collections: z.array(TemplateCollection),
});
