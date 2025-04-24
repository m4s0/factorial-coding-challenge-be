import { ProductOption } from '@Shop/entities/product-option.entity';
import { ProductOptionGroup } from '@Shop/entities/product-option-group.entity';
import { transformProductOptionGroup } from './product-option-group.transformer';

describe('transformOptionGroup', () => {
  it('should transform product option group correctly', () => {
    const productOptionGroup = {
      id: '123',
      name: 'Size',
      displayName: 'Select Size',

      options: [] as ProductOption[],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    } as ProductOptionGroup;

    const result = transformProductOptionGroup(productOptionGroup);

    expect(result).toMatchSnapshot();
  });
});
