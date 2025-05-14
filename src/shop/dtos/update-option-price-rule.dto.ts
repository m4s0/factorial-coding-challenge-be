import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateOptionPriceRuleSchema = z.object({
  price: z.number().optional(),
  targetOptionId: z.string().uuid().optional(),
  dependentOptionId: z.string().uuid().optional(),
  isActive: z.boolean().default(true).optional(),
});

export class UpdateOptionPriceRuleDto extends createZodDto(
  updateOptionPriceRuleSchema,
) {}
