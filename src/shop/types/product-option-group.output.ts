import { ProductOptionOutput } from './product-option.output';
import { ProductOutput } from './product.output';

export type ProductOptionGroupOutput = {
  id: string;
  name: string;
  displayName: string;
  options?: ProductOptionOutput[];
  productId?: string;
  product?: ProductOutput;
  createdAt: string;
  updatedAt: string;
};
