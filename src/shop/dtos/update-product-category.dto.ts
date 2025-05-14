import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const updateProductCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters')
    .optional(),

  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be at most 500 characters')
    .optional(),

  isActive: z.boolean().default(true).optional(),
});

export class UpdateProductCategoryDto extends createZodDto(
  updateProductCategorySchema,
) {}
