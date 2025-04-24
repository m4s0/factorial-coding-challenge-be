import { EntityManager } from 'typeorm';
import { ProductOption } from '@Shop/entities/product-option.entity';
import { ProductOptionGroup } from '@Shop/entities/product-option-group.entity';

export async function createProductOption(
  entityManager: EntityManager,
  optionGroup: ProductOptionGroup,
  override: Partial<ProductOption> = {},
): Promise<ProductOption> {
  const productOption = entityManager.create(ProductOption, {
    name: 'Mountain Wheels',
    displayName: 'Mountain Wheels display name',
    basePrice: 10.99,
    isActive: true,
    optionGroupId: optionGroup.id,
    optionGroup,
    ...override,
  });
  await entityManager.save(productOption);

  return productOption;
}
