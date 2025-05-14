import { OptionRule } from '@Shop/entities/option-rule.entity';
import { RuleType } from '@Shop/entities/rule-type';
import { transformOptionRule } from './option-rule.transformer';

describe('transformOptionRule', () => {
  it('should transform option rule correctly', () => {
    const optionRule = {
      id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
      ruleType: RuleType.REQUIRES,
      ifOptionId: '4636127e-769e-4136-9a6a-8fddb7ca9692',
      ifOption: {
        id: '4636127e-769e-4136-9a6a-8fddb7ca9692',
        name: 'Size',
        displayName: 'Product Size',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      },
      thenOptionId: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
      thenOption: {
        id: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
        name: 'Color',
        displayName: 'Product Color',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      },
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    } as OptionRule;

    const result = transformOptionRule(optionRule);

    expect(result).toMatchSnapshot();
  });
});
