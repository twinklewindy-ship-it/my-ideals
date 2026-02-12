import { z } from 'zod';

export type TemplateResourceBaseUrl = {
  root: string;
  format: 'jpg' | 'png' | 'webp';
  fallback?: string;
};

export const TemplateResourceBaseUrlSchema = z.object({
  // 使用 z.string().url()
  root: z.string().url(),
  format: z.enum(['jpg', 'png', 'webp']),
  fallback: z.string().url().optional(),
});

export const urlFromBaseUrl = (id: string, config: TemplateResourceBaseUrl): string =>
  `${config.root}/${id}.${config.format}`;
