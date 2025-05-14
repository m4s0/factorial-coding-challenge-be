import { ProductOptionOutput } from '@Shop/types/product-option.output';

export type InventoryItemOutput = {
  id: string;
  quantity: number;
  outOfStock: boolean;
  productOptionId: string;
  productOption?: ProductOptionOutput;
  createdAt: string;
  updatedAt: string;
};
