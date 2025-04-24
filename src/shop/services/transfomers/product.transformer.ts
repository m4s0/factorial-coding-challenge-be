import { InventoryStatusForProduct } from '@Shop/types/inventory-status-for-product';
import { Product } from '../../entities/product.entity';
import { ProductOutput } from '../../types/product.output';
import { transformProductCategory } from './product-category.transformer';
import { transformProductOptionGroup } from './product-option-group.transformer';

export function transformProduct(
  product: Product,
  optionInventory?: InventoryStatusForProduct[],
): ProductOutput {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    basePrice: Number(product.basePrice),
    isActive: product.isActive,
    categoryId: product.categoryId,
    ...(product.category && {
      category: transformProductCategory(product.category),
    }),
    ...(product.optionGroups && {
      optionGroups: product.optionGroups.map((optionGroup) =>
        transformProductOptionGroup(optionGroup, optionInventory),
      ),
    }),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}
