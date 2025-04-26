import { Product } from '@Shop/entities/product.entity';
import { ProductOptionGroup } from '@Shop/entities/product-option-group.entity';
import { OptionRule } from '@Shop/entities/option-rule.entity';
import { transformProduct } from '@Shop/services/transfomers/product.transformer';
import { transformOptionRule } from '@Shop/services/transfomers/option-rule.transformer';
import { transformProductOptionGroup } from '@Shop/services/transfomers/product-option-group.transformer';
import { ProductConfigurationOutput } from '@Shop/types/product-configuration.output';

export function transformProductConfiguration(
  product: Product,
  optionGroups: ProductOptionGroup[],
  rules: OptionRule[],
): ProductConfigurationOutput {
  return {
    product: transformProduct(product),
    optionGroups: optionGroups.map((optionGroup) =>
      transformProductOptionGroup(optionGroup),
    ),
    rules: rules.map((rule) => transformOptionRule(rule)),
  };
}
