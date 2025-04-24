import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const updateProductOptionSchema = z.object({
  name: z
    .string({
      required_error: 'Technical name is required',
      description: 'Technical name for the option',
    })
    .min(1)
    .optional(),

  displayName: z
    .string({
      required_error: 'Display name is required',
      description: 'Display name for the option',
    })
    .min(1)
    .optional(),

  basePrice: z
    .number({
      required_error: 'Base price is required',
      description: 'Base price for this option',
    })
    .optional(),

  isActive: z
    .boolean({
      description: 'Whether this option is active',
    })
    .default(true)
    .optional(),

  optionGroupId: z
    .string({
      required_error: 'Option group ID is required',
      description: 'Option group ID this option belongs to',
    })
    .uuid()
    .optional(),
});

export class UpdateProductOptionDto extends createZodDto(
  updateProductOptionSchema,
) {}
