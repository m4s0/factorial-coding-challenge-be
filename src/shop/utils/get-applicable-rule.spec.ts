import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { ProductOption } from '@Shop/entities/product-option.entity';
import { createUUID } from '@Common/utils/create-uuid';
import { getApplicableRule } from './get-applicable-rule';

describe('getApplicableRule()', () => {
  it('should return applicable rule when option is dependent and target exists', () => {
    const dependentId = createUUID();
    const targetId = createUUID();

    const rule = {
      id: createUUID(),
      dependentOptionId: dependentId,
      targetOptionId: targetId,
      price: 10,
    } as OptionPriceRule;

    const option = {
      id: dependentId,
      name: 'Option 1',
    } as ProductOption;

    const selectedOptions = [
      option,
      { id: targetId, name: 'Option 2' } as ProductOption,
    ];

    const result = getApplicableRule([rule], option, selectedOptions);
    expect(result).toBe(rule);
  });

  it('should return null when option is not dependent', () => {
    const dependentId = createUUID();
    const targetId = createUUID();

    const rule = {
      id: createUUID(),
      dependentOptionId: dependentId,
      targetOptionId: targetId,
      price: 10,
    } as OptionPriceRule;

    const option = {
      id: createUUID(),
      name: 'Option 3',
    } as ProductOption;

    const selectedOptions = [
      option,
      { id: targetId, name: 'Option 2' } as ProductOption,
    ];

    const result = getApplicableRule([rule], option, selectedOptions);
    expect(result).toBeNull();
  });

  it('should return null when target option is not selected', () => {
    const dependentId = createUUID();
    const targetId = createUUID();

    const rule = {
      id: createUUID(),
      dependentOptionId: dependentId,
      targetOptionId: targetId,
      price: 10,
    } as OptionPriceRule;

    const option = {
      id: dependentId,
      name: 'Option 1',
    } as ProductOption;

    const selectedOptions = [
      option,
      { id: createUUID(), name: 'Option 3' } as ProductOption,
    ];

    const result = getApplicableRule([rule], option, selectedOptions);
    expect(result).toBeNull();
  });

  it('should return null when no rules are provided', () => {
    const option = {
      id: createUUID(),
      name: 'Option 1',
    } as ProductOption;

    const selectedOptions = [
      option,
      { id: createUUID(), name: 'Option 2' } as ProductOption,
    ];

    const result = getApplicableRule([], option, selectedOptions);
    expect(result).toBeNull();
  });
});
