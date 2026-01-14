import { z } from 'zod';

const ProfileTemplateInfoSchema = z.object({
  link: z.string(),
  id: z.string(),
  revision: z.int(),
});

export const ProfileSchema = z.object({
  magic: z.literal('my-ideals-profile'),
  version: z.literal(1),
  id: z.nanoid(),
  name: z.string(),
  template: ProfileTemplateInfoSchema,
  selectedMembers: z.array(z.string()).default([]),
  collections: z.record(z.string(), z.record(z.string(), z.boolean())),
});
