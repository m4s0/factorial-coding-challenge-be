import { ProductOption } from '@Shop/entities/product-option.entity';
import { ProductOptionGroup } from '@Shop/entities/product-option-group.entity';
import { Product } from '@Shop/entities/product.entity';
import { RuleType } from '@Shop/entities/rule-type';
import { OptionRule } from '@Shop/entities/option-rule.entity';
import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { transformProductOptionGroup } from './product-option-group.transformer';

describe('transformOptionGroup', () => {
  it('should transform product option group correctly', () => {
    const productOptionGroup = {
      id: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
      name: 'Size',
      displayName: 'Select Size',
      product: {
        id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
        name: 'Test Product',
        description: 'Test Description',
        basePrice: 99.99,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      } as Product,
      options: [
        {
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
      ] as ProductOption[],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    } as ProductOptionGroup;

    const result = transformProductOptionGroup(productOptionGroup);

    expect(result).toMatchSnapshot();
  });
});
