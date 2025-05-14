import { ProductOption } from '@Shop/entities/product-option.entity';
import { transformProductOption } from './product-option.transform';

describe('transformProductOption', () => {
  it('should transform product option correctly', () => {
    const productOption = {
      id: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
      name: 'Size',
      displayName: 'Product Size',
      basePrice: 10.99,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    } as ProductOption;

    const result = transformProductOption(productOption);

    expect(result).toMatchSnapshot();
  });
});
