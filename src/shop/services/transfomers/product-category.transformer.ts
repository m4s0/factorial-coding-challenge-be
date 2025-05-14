import { Product } from '@Shop/entities/product.entity';
import { ProductOutput } from '@Shop/types/product.output';
import { transformProductOptionGroup } from '@Shop/services/transfomers/product-option-group.transformer';
import { ProductCategoryOutput } from '../../types/product-category.output';
import { ProductCategory } from '../../entities/product-category.entity';

function transformProduct(product: Product): ProductOutput {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    basePrice: Number(Number(product.basePrice).toFixed(2)),
    isActive: product.isActive,
    optionGroups: product.optionGroups.map((productOptionGroup) => {
      return transformProductOptionGroup(productOptionGroup);
    }),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function transformProductCategory(
  category: ProductCategory,
): ProductCategoryOutput {
  return {
    id: category.id,
    name: category.name,
    description: category.description,
    isActive: category.isActive,
    ...(category.products &&
      category.products.length > 0 && {
        products: category.products.map((product) => transformProduct(product)),
      }),
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}
