import { EntityManager } from 'typeorm';
import { ProductCategory } from '@Shop/entities/product-category.entity';
import { createUUID } from '@Common/utils/create-uuid';

export async function createCategory(
  entityManager: EntityManager,
  override: Partial<ProductCategory> = {},
) {
  const category = entityManager.create(ProductCategory, {
    name: `Bicycle-${createUUID()}`,
    description: 'Bicycle category',
    ...override,
  });
  await entityManager.save(category);

  return category;
}
