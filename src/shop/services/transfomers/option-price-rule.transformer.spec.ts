import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { transformOptionPriceRule } from '@Shop/services/transfomers/option-price-rule.transformer';
import { ProductOptionGroup } from '@Shop/entities/product-option-group.entity';
import { ProductOption } from '@Shop/entities/product-option.entity';
import { Product } from '@Shop/entities/product.entity';

describe('transformOptionPriceRule', () => {
  it('should transform option price rule with all fields correctly', () => {
    const optionPriceRule = {
      id: 'price_1',
      price: 29.99,
      targetOptionId: 'opt_1',
      targetOption: {
        id: 'opt_1',
        name: 'Color',
        displayName: 'Product Color',
        basePrice: 19.99,
        isActive: true,
        optionGroupId: 'group_1',
        optionGroup: {
          id: 'group123',
          name: 'Sizes',
          isActive: true,
          displayName: 'Sizes',
          productId: '123',
          product: {
            id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
            name: 'Test Product',
            description: 'Test Description',
            basePrice: 99.99,
            isActive: true,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          } as Product,

          options: [] as ProductOption[],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as ProductOptionGroup,
        inventoryItems: [],
        rulesAsCondition: [],
        rulesAsResult: [],
        priceRules: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      } as ProductOption,
      dependentOptionId: 'opt_2',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    } as OptionPriceRule;

    const result = transformOptionPriceRule(optionPriceRule);

    expect(result).toMatchSnapshot();
  });

  it('should transform option price rule with minimal fields correctly', () => {
    const optionPriceRule = {
      id: 'price_1',
      price: 29.99,
      targetOptionId: 'opt_1',
      targetOption: {
        id: 'opt_1',
        name: 'Color',
        isActive: true,
        optionGroupId: 'group_1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      } as ProductOption,
      dependentOptionId: 'opt_2',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    } as OptionPriceRule;

    const result = transformOptionPriceRule(optionPriceRule);

    expect(result).toMatchSnapshot();
  });
});
