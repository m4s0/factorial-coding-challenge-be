import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { ProductOption } from '@Shop/entities/product-option.entity';

export function getApplicableRule(
  appliedRules: OptionPriceRule[],
  option: ProductOption,
  selectedProductOptions: ProductOption[],
): OptionPriceRule | null {
  for (const rule of appliedRules) {
    const dependentOption =
      option.id === rule.dependentOptionId ? option : null;

    const targetOption = selectedProductOptions.find(
      (productOption) => productOption.id === rule.targetOptionId,
    );

    if (targetOption && dependentOption) {
      return rule;
    }
  }

  return null;
}
