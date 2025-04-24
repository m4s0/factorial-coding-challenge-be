import { ProductOption } from '@Shop/entities/product-option.entity';
import { OptionRule } from '@Shop/entities/option-rule.entity';
import { InventoryItem } from '@Shop/entities/inventory-item.entity';
import { ProductOptionGroup } from '@Shop/entities/product-option-group.entity';
import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { Product } from '@Shop/entities/product.entity';
import { RuleType } from '@Shop/entities/rule-type';
import { transformProductOption } from './product-option.transform';

describe('transformProductOption', () => {
  it('should transform product option correctly', () => {
    const productOption = {
      id: '123',
      name: 'Size',
      displayName: 'Product Size',
      basePrice: 10.99,
      isActive: true,
      optionGroupId: 'group123',
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
      inventoryItems: [
        {
          id: 'inv123',
          quantity: 5,
          isActive: true,
          outOfStock: false,
          productOption: {} as ProductOption,
          productOptionId: '123',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as InventoryItem,
      ],
      rulesAsCondition: [
        {
          id: 'rule123',
          ruleType: RuleType.REQUIRES,
          isActive: true,
          ifOption: {} as ProductOption,
          ifOptionId: 'option123',
          thenOption: {} as ProductOption,
          thenOptionId: 'group123',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as OptionRule,
      ],
      rulesAsResult: [
        {
          id: 'rule456',
          ruleType: RuleType.REQUIRES,
          isActive: true,
          ifOption: {} as ProductOption,
          ifOptionId: 'option456',
          thenOption: {} as ProductOption,
          thenOptionId: 'option789',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as OptionRule,
      ],
      priceRules: [
        {
          id: 'price123',
          price: 5.0,
          targetOption: {} as ProductOption,
          targetOptionId: '123',
          dependentOption: {} as ProductOption,
          dependentOptionId: '456',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as OptionPriceRule,
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    } as ProductOption;

    const result = transformProductOption(productOption);

    expect(result).toMatchSnapshot();
  });
});
