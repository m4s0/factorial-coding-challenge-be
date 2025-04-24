import { OptionRule } from '@Shop/entities/option-rule.entity';
import { RuleType } from '@Shop/entities/rule-type';
import { transformOptionRule } from './option-rule.transformer';

describe('transformOptionRule', () => {
  it('should transform option rule correctly', () => {
    const optionRule = {
      id: 'rule123',
      ruleType: RuleType.REQUIRES,
      ifOptionId: 'option1',
      ifOption: {
        id: 'option1',
        name: 'Size',
        displayName: 'Product Size',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      },
      thenOptionId: 'option2',
      thenOption: {
        id: 'option2',
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
