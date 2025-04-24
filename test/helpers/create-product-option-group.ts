import { EntityManager } from 'typeorm';
import { Product } from '@Shop/entities/product.entity';
import { ProductOptionGroup } from '@Shop/entities/product-option-group.entity';

export async function createProductOptionGroup(
  entityManager: EntityManager,
  product: Product,
  override: Partial<ProductOptionGroup> = {},
): Promise<ProductOptionGroup> {
  const productOptionGroup = entityManager.create(ProductOptionGroup, {
    name: 'Wheels',
    displayName: 'Wheels',
    productId: product.id,
    product,
    ...override,
  });
  await entityManager.save(productOptionGroup);

  return productOptionGroup;
}
