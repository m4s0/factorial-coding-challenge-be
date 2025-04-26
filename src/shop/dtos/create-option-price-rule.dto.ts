import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createOptionPriceRuleSchema = z.object({
  price: z.number(),
  targetOptionId: z.string().uuid(),
  dependentOptionId: z.string().uuid(),
  isActive: z.boolean().default(true),
});

export class CreateOptionPriceRuleDto extends createZodDto(
  createOptionPriceRuleSchema,
) {}
