import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { OptionPriceRuleOutput } from '@Shop/types/option-price-rule.output';
import { transformProductOption } from '@Shop/services/transfomers/product-option.transform';

export function transformOptionPriceRule(
  optionPriceRule: OptionPriceRule,
): OptionPriceRuleOutput {
  return {
    id: optionPriceRule.id,
    price: optionPriceRule.price,
    targetOptionId: optionPriceRule.targetOptionId,
    ...(optionPriceRule.targetOption && {
      targetOption: transformProductOption(optionPriceRule.targetOption),
    }),
    dependentOptionId: optionPriceRule.dependentOptionId,
    ...(optionPriceRule.dependentOption && {
      dependentOption: transformProductOption(optionPriceRule.dependentOption),
    }),
    isActive: optionPriceRule.isActive,
    createdAt: optionPriceRule.createdAt.toISOString(),
    updatedAt: optionPriceRule.updatedAt.toISOString(),
  };
}
