import { EntityManager } from 'typeorm';
import { Product } from '@Shop/entities/product.entity';

export async function createProduct(
  entityManager: EntityManager,
  override: Partial<Product> = {},
): Promise<Product> {
  const product = entityManager.create(Product, {
    name: 'Trailblazer Pro',
    description: 'Trailblazer Pro description',
    isActive: true,
    basePrice: 72.99,
    optionGroups: [],
    ...override,
  });
  await entityManager.save(product);

  return product;
}
