import { ProductCategoryOutput } from './product-category.output';
import { ProductOptionGroupOutput } from './product-option-group.output';

export type ProductOutput = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
  categoryId?: string;
  category?: ProductCategoryOutput;
  optionGroups?: ProductOptionGroupOutput[];
  isValidConfiguration?: boolean;
  price?: number;
  createdAt: string;
  updatedAt: string;
};
