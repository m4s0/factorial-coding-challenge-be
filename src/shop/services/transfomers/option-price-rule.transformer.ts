import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { OptionPriceRuleOutput } from '@Shop/types/option-price-rule.output';
import { transformProductOption } from '@Shop/services/transfomers/product-option.transform';

export function transformOptionPriceRule(
  optionPriceRule: OptionPriceRule,
): OptionPriceRuleOutput {
  return {
    id: optionPriceRule.id,
    price: Number(optionPriceRule.price),
    targetOptionId: optionPriceRule.targetOptionId,
    targetOption: transformProductOption(optionPriceRule.targetOption),
    dependentOptionId: optionPriceRule.dependentOptionId,
    isActive: optionPriceRule.isActive,
    createdAt: optionPriceRule.createdAt.toISOString(),
    updatedAt: optionPriceRule.updatedAt.toISOString(),
  };
}
