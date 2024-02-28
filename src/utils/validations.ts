import { z as zod } from 'zod';


export const searchByIdSchema = zod.object({
  productId: zod.coerce.string()
});

export const searchByTermSchema = zod.object({
  nova: zod
    .coerce
    .number()
    .min(1)
    .max(4)
    .optional(),

  nutrition: zod
    .string()
    .regex(/^[A-E]$/i)
    .optional(),

  page: zod.coerce.number().nullable(),
});
