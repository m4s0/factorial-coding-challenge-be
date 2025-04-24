import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const updateProductSchema = z.object({
  name: z
    .string({
      required_error: 'Product name is required',
      description: 'Product name',
    })
    .min(1)
    .optional(),

  description: z
    .string({
      required_error: 'Product description is required',
      description: 'Product description',
    })
    .min(1)
    .optional(),

  basePrice: z
    .number({
      required_error: 'Base price is required',
      description: 'Base price of the product',
    })
    .optional(),

  isActive: z
    .boolean({
      description: 'Whether the product is active',
    })
    .default(true)
    .optional(),

  categoryId: z
    .string({
      required_error: 'Category ID is required',
      description: 'Category ID for the product',
    })
    .uuid()
    .optional(),
});

export class UpdateProductDto extends createZodDto(updateProductSchema) {}
