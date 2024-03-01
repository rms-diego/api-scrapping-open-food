import { z as zod } from 'zod';

export const searchByIdSchema = zod.object({
  productId: zod.coerce.number(),
});

export const searchByTermSchema = zod.object({
  nova: zod.coerce
    .number()
    .min(1, { message: 'min nova is 1' })
    .max(4, { message: 'max nova is 4' })
    .optional(),

  nutrition: zod.coerce
    .string()
    .regex(/^[A-E]$/i, { message: "wrong nutrition, only accept 'A', 'B', 'C', 'D', 'E'" })
    .optional(),

  page: zod.coerce.string().optional(),
});
