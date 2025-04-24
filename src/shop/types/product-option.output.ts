import { InventoryItemOutput } from '@Shop/types/inventory-item.output';
import { OptionRuleOutput } from '@Shop/types/option-rule.output';
import { OptionPriceRuleOutput } from '@Shop/types/option-price-rule.output';
import { ProductOptionGroupOutput } from './product-option-group.output';

export type ProductOptionOutput = {
  id: string;
  name: string;
  displayName: string;
  basePrice: number | null;
  isActive: boolean;
  optionGroupId: string;
  optionGroup: ProductOptionGroupOutput;
  inventoryItems: InventoryItemOutput[];
  rulesAsCondition: OptionRuleOutput[];
  rulesAsResult: OptionRuleOutput[];
  priceRules: OptionPriceRuleOutput[];
  inStock?: boolean;
  createdAt: string;
  updatedAt: string;
};
