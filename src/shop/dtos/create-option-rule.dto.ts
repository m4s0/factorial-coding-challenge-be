import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { RuleType } from '@Shop/entities/rule-type';

const createOptionRuleSchema = z.object({
  ifOptionId: z.string().uuid(),
  thenOptionId: z.string().uuid(),
  ruleType: z.nativeEnum(RuleType),
});

export class CreateOptionRuleDto extends createZodDto(createOptionRuleSchema) {}
