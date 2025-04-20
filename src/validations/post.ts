import { z } from 'zod';

export const postSchema = z.object({
  text: z.string().min(1, { message: 'Text is required' }),
  parent_id: z.number().optional(),
});
