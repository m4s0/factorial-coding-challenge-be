import { ProductCategory } from '../../entities/product-category.entity';
import { transformProductCategory } from './product-category.transformer';

describe('transformProductCategory', () => {
  it('should transform product category correctly', () => {
    const productCategory = {
      id: '123',
      name: 'Electronics',
      description: 'Electronic devices and accessories',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    } as ProductCategory;

    const result = transformProductCategory(productCategory);

    expect(result).toMatchSnapshot();
  });
});
