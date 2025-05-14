import { OptionRule } from '@Shop/entities/option-rule.entity';
import { OptionRuleOutput } from '@Shop/types/option-rule.output';
import { transformProductOption } from '@Shop/services/transfomers/product-option.transform';

export function transformOptionRule(optionRule: OptionRule): OptionRuleOutput {
  return {
    id: optionRule.id,
    ruleType: optionRule.ruleType,
    ifOptionId: optionRule.ifOptionId,
    ...(optionRule.ifOption && {
      ifOption: transformProductOption(optionRule.ifOption),
    }),
    thenOptionId: optionRule.thenOptionId,
    ...(optionRule.thenOption && {
      thenOption: transformProductOption(optionRule.thenOption),
    }),
    isActive: optionRule.isActive,
    createdAt: optionRule.createdAt.toISOString(),
    updatedAt: optionRule.updatedAt.toISOString(),
  };
}
