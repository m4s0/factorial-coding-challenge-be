import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { transformOptionPriceRule } from '@Shop/services/transfomers/option-price-rule.transformer';
import { ProductOption } from '@Shop/entities/product-option.entity';

describe('transformOptionPriceRule', () => {
  it('should transform option price rule correctly', () => {
    const optionPriceRule = {
      id: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
      price: 29.99,
      targetOptionId: '4636127e-769e-4136-9a6a-8fddb7ca9692',
      targetOption: {
        id: '4636127e-769e-4136-9a6a-8fddb7ca9692',
        name: 'Color',
        displayName: 'Product Color',
        basePrice: 19.99,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      } as ProductOption,
      dependentOptionId: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
      dependentOption: {
        id: '3df0a970-d440-4361-940c-07a8ef39c333',
        name: 'Color',
        displayName: 'Product Color',
        basePrice: 19.99,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      } as ProductOption,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    } as OptionPriceRule;

    const result = transformOptionPriceRule(optionPriceRule);

    expect(result).toMatchSnapshot();
  });
});
