import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createProductSchema = z.object({
  name: z
    .string({
      required_error: 'Product name is required',
      description: 'Product name',
    })
    .min(1),

  description: z
    .string({
      required_error: 'Product description is required',
      description: 'Product description',
    })
    .min(1),

  basePrice: z.number({
    required_error: 'Base price is required',
    description: 'Base price of the product',
  }),

  isActive: z
    .boolean({
      description: 'Whether the product is active',
    })
    .optional()
    .default(true),

  categoryId: z
    .string({
      required_error: 'Category ID is required',
      description: 'Category ID for the product',
    })
    .uuid(),
});

export class CreateProductDto extends createZodDto(createProductSchema) {}
