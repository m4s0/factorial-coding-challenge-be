import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const createProductOptionSchema = z.object({
  name: z
    .string({
      required_error: 'Technical name is required',
      description: 'Technical name for the option',
    })
    .min(1),

  displayName: z
    .string({
      required_error: 'Display name is required',
      description: 'Display name for the option',
    })
    .min(1),

  basePrice: z.number({
    required_error: 'Base price is required',
    description: 'Base price for this option',
  }),

  isActive: z
    .boolean({
      description: 'Whether this option is active',
    })
    .optional()
    .default(true),

  optionGroupId: z
    .string({
      required_error: 'Option group ID is required',
      description: 'Option group ID this option belongs to',
    })
    .uuid(),
});

export class CreateProductOptionDto extends createZodDto(
  createProductOptionSchema,
) {}
