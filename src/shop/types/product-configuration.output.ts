import { ProductOutput } from '@Shop/types/product.output';
import { ProductOptionGroupOutput } from '@Shop/types/product-option-group.output';
import { OptionRuleOutput } from '@Shop/types/option-rule.output';

export type ProductConfigurationOutput = {
  product: ProductOutput;
  optionGroups: ProductOptionGroupOutput[];
  rules: OptionRuleOutput[];
};
