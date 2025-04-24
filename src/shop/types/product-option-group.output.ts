import { ProductOptionOutput } from '@Shop/types/product-option.output';

export type ProductOptionGroupOutput = {
  id: string;
  name: string;
  displayName: string;
  options: ProductOptionOutput[];
  createdAt: string;
  updatedAt: string;
};
