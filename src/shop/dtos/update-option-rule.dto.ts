import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { RuleType } from '@Shop/entities/rule-type';

const updateOptionRuleSchema = z.object({
  ifOptionId: z.string().uuid().optional(),
  thenOptionId: z.string().uuid().optional(),
  ruleType: z.nativeEnum(RuleType).optional(),
});

export class UpdateOptionRuleDto extends createZodDto(updateOptionRuleSchema) {}
