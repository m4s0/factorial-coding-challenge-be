import { ProductOption } from '@Shop/entities/product-option.entity';
import { InventoryItem } from '@Shop/entities/inventory-item.entity';
import { OptionRule } from '@Shop/entities/option-rule.entity';
import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { ProductOptionGroup } from '../../entities/product-option-group.entity';
import { ProductCategory } from '../../entities/product-category.entity';
import { transformProduct } from './product.transformer';
import { Product } from '../../entities/product.entity';

describe('transformProduct', () => {
  it('should transform product correctly', () => {
    const product = {
      id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
      name: 'Test Product',
      description: 'Test Description',
      basePrice: 99.99,
      isActive: true,
      category: {
        id: '8f7e9d2c-3b4a-5c6d-7e8f-9a0b1c2d3e4f',
        name: 'Test Category',
        isActive: true,
        description: 'Test Description',
        products: [] as Product[],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      } as ProductCategory,
      categoryId: '8f7e9d2c-3b4a-5c6d-7e8f-9a0b1c2d3e4f',
      optionGroups: [
        {
          id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
          name: 'Test Option Group',
          displayName: 'Test Option Group',
          isActive: true,
          options: [
            {
              id: '7ba7b5bd-2390-43d6-9893-e959068a1116',
              name: 'Option-095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
              displayName: 'Large',
              basePrice: 6,
              isActive: true,
              optionGroupId: '095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
              optionGroup: {
                id: '814c6b60-2965-4464-abed-1587b4668e1e',
                name: 'Size',
                displayName: 'Size',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-02'),
              } as ProductOptionGroup,
              inventoryItemId: '5c39c75d-93a9-4c73-a7bf-ef107340fa8e',
              inventoryItem: {
                id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
                quantity: 100,
                outOfStock: false,
                productOptionId: '13585532-a295-4a82-b7bf-0abc07064ee9',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-02'),
              } as InventoryItem,
              rulesAsCondition: [] as OptionRule[],
              rulesAsResult: [] as OptionRule[],
              priceRules: [] as OptionPriceRule[],
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-02'),
            } as ProductOption,
          ],
          product: {
            id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
            name: 'Test Product',
            description: 'Test Description',
            basePrice: 99.99,
            isActive: true,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          } as Product,
          productId: '',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        } as ProductOptionGroup,
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    } as Product;

    const result = transformProduct(product);
    expect(result).toMatchSnapshot();
  });
});
