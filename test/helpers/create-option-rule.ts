import { RuleType } from '@Shop/entities/rule-type';
import { OptionRule } from '@Shop/entities/option-rule.entity';
import { EntityManager } from 'typeorm';

export async function createOptionRule(
  entityManager: EntityManager,
  ifOptionId: string,
  thenOptionId: string,
  ruleType: RuleType,
  override: Partial<OptionRule> = {},
): Promise<OptionRule> {
  const optionRule = entityManager.create(OptionRule, {
    ifOptionId,
    thenOptionId,
    ruleType,
    ...override,
  });
  await entityManager.save(optionRule);

  return optionRule;
}
