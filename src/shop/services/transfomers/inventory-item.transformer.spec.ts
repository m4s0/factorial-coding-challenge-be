import { InventoryItem } from '@Shop/entities/inventory-item.entity';
import { ProductOption } from '@Shop/entities/product-option.entity';
import { RuleType } from '@Shop/entities/rule-type';
import { OptionRule } from '@Shop/entities/option-rule.entity';
import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { transformInventoryItem } from './inventory-item.transformer';

describe('transformInventoryItem', () => {
  it('should transform inventory item with all fields correctly', () => {
    const inventoryItem = {
      id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
      quantity: 100,
      outOfStock: false,
      productOptionId: '13585532-a295-4a82-b7bf-0abc07064ee9',
      productOption: {
        id: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
        name: 'Size',
        displayName: 'Product Size',
        basePrice: 10.99,
        isActive: true,
        optionGroupId: '31b7d272-3664-4a7f-87f7-09d95c60dfac',
        rulesAsCondition: [
          {
            id: '13585532-a295-4a82-b7bf-0abc07064ee9',
            ruleType: RuleType.REQUIRES,
            isActive: true,
            ifOptionId: 'a8f340f5-f724-43f8-b0c8-c43c29220923',
            thenOptionId: '31b7d272-3664-4a7f-87f7-09d95c60dfac',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-02'),
          } as OptionRule,
        ],
        rulesAsResult: [
          {
            id: 'd8cb0d41-f2bf-40ec-8f0d-24316c9eb94b',
            ruleType: RuleType.REQUIRES,
            isActive: true,
            ifOptionId: 'ec428b31-7b25-472f-813f-ff05022f580e',
            thenOptionId: '4f0bbaec-fe89-43d6-ac39-9fa215bd3bbd',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-02'),
          } as OptionRule,
        ],
        priceRules: [
          {
            id: '2b6c2ef0-776e-4e55-b3ad-7059539150ce',
            price: 5.0,
            targetOptionId: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
            dependentOptionId: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
            isActive: true,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-02'),
          } as OptionPriceRule,
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      } as ProductOption,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    } as InventoryItem;

    const result = transformInventoryItem(inventoryItem);

    expect(result).toMatchSnapshot();
  });

  it('should transform inventory item with zero quantity and out of stock', () => {
    const inventoryItem = {
      id: 'a8f340f5-f724-43f8-b0c8-c43c29220923',
      quantity: 0,
      outOfStock: true,
      productOptionId: '4636127e-769e-4136-9a6a-8fddb7ca9692',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    } as InventoryItem;

    const result = transformInventoryItem(inventoryItem);

    expect(result).toMatchSnapshot();
  });
});
