import { ProductCategory } from '../../entities/product-category.entity';
import { ProductCategoryOutput } from '../../types/product-category.output';

export function transformProductCategory(
  category: ProductCategory,
): ProductCategoryOutput {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    isActive: category.isActive,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}
