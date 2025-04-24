import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const productConfigurationSchema = z.object({
  optionIds: z
    .union([z.string().uuid(), z.array(z.string().uuid())])
    .transform((optionIds) =>
      Array.isArray(optionIds) ? optionIds : [optionIds],
    )
    .pipe(
      z
        .array(z.string().uuid(), {
          required_error: 'ProductOption IDs are required',
          description: 'Array of ProductOption ID configurations',
        })
        .min(1),
    ),
});

export class ProductConfigurationQueryDto extends createZodDto(
  productConfigurationSchema,
) {}
