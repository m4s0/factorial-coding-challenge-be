import { EntityManager } from 'typeorm';
import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { ProductOption } from '@Shop/entities/product-option.entity';

export async function createOptionPriceRule(
  entityManager: EntityManager,
  targetOption: ProductOption,
  dependentOption: ProductOption,
  override: Partial<OptionPriceRule> = {},
): Promise<OptionPriceRule> {
  const optionPriceRule = entityManager.create(OptionPriceRule, {
    targetOptionId: targetOption.id,
    targetOption,
    dependentOption,
    dependentOptionId: dependentOption.id,
    price: 10,
    isActive: true,
    ...override,
  });
  await entityManager.save(optionPriceRule);

  return optionPriceRule;
}
