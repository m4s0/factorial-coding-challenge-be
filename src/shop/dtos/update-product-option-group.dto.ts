import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const updateProductOptionGroupSchema = z.object({
  name: z
    .string({
      required_error: 'Technical name is required',
      description: 'Technical name for the option group',
    })
    .min(1)
    .optional(),

  displayName: z
    .string({
      required_error: 'Display name is required',
      description: 'Display name for the option group',
    })
    .min(1)
    .optional(),

  productId: z
    .string({
      required_error: 'Product ID is required',
      description: 'Product ID this option group belongs to',
    })
    .uuid()
    .optional(),
});

export class UpdateProductOptionGroupDto extends createZodDto(
  updateProductOptionGroupSchema,
) {}
