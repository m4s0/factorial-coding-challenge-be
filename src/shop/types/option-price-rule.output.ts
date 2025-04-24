import { ProductOptionOutput } from '@Shop/types/product-option.output';

export type OptionPriceRuleOutput = {
  id: string;
  price: number;
  targetOptionId: string;
  targetOption: ProductOptionOutput;
  dependentOptionId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
