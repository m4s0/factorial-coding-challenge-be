import { ProductOutput } from '@Shop/types/product.output';

export type ProductCategoryOutput = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  products?: ProductOutput[];
  createdAt: string;
  updatedAt: string;
};
