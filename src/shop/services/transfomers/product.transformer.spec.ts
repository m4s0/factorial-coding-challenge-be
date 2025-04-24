import { Product } from '../../entities/product.entity';
import { transformProduct } from './product.transformer';
import { ProductCategory } from '../../entities/product-category.entity';
import { ProductOptionGroup } from '../../entities/product-option-group.entity';

describe('transformProduct', () => {
  it('should transform a complete product with category and option groups', () => {
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
          options: [],
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
