import { OptionRule } from '@Shop/entities/option-rule.entity';
import { RuleType } from '@Shop/entities/rule-type';
import { LogicException } from '@Common/exceptions/logic-exception';
import { ProductOption } from '@Shop/entities/product-option.entity';
import { isRuleValid } from './is-rule-valid';

describe('isRuleValid()', () => {
  it('should validate REQUIRES rule correctly', () => {
    const rule = {
      ifOptionId: 'baed87df-bfd2-416f-80aa-a8c8e3ee5991',
      thenOptionId: 'dc9510be-4117-4f85-977d-e09d5c1c76f2',
      ruleType: RuleType.REQUIRES,
    } as OptionRule;

    expect(
      isRuleValid(rule, [
        { id: 'baed87df-bfd2-416f-80aa-a8c8e3ee5991' } as ProductOption,
        { id: 'dc9510be-4117-4f85-977d-e09d5c1c76f2' } as ProductOption,
      ]),
    ).toBe(true);

    expect(
      isRuleValid(rule, [
        { id: 'baed87df-bfd2-416f-80aa-a8c8e3ee5991' } as ProductOption,
      ]),
    ).toBe(false);

    expect(
      isRuleValid(rule, [
        { id: 'dc9510be-4117-4f85-977d-e09d5c1c76f2' } as ProductOption,
      ]),
    ).toBe(true);

    expect(isRuleValid(rule, [])).toBe(true);
  });

  it('should validate EXCLUDES rule correctly', () => {
    const rule = {
      ifOptionId: 'baed87df-bfd2-416f-80aa-a8c8e3ee5991',
      thenOptionId: 'dc9510be-4117-4f85-977d-e09d5c1c76f2',
      ruleType: RuleType.EXCLUDES,
    } as OptionRule;

    expect(
      isRuleValid(rule, [
        { id: 'baed87df-bfd2-416f-80aa-a8c8e3ee5991' } as ProductOption,
        { id: 'dc9510be-4117-4f85-977d-e09d5c1c76f2' } as ProductOption,
      ]),
    ).toBe(false);

    expect(
      isRuleValid(rule, [
        { id: 'baed87df-bfd2-416f-80aa-a8c8e3ee5991' } as ProductOption,
      ]),
    ).toBe(true);

    expect(
      isRuleValid(rule, [
        { id: 'dc9510be-4117-4f85-977d-e09d5c1c76f2' } as ProductOption,
      ]),
    ).toBe(true);

    expect(isRuleValid(rule, [])).toBe(true);
  });

  it('should validate ONLY_ALLOWS rule correctly', () => {
    const rule = {
      ifOptionId: 'baed87df-bfd2-416f-80aa-a8c8e3ee5991',
      thenOptionId: 'dc9510be-4117-4f85-977d-e09d5c1c76f2',
      ruleType: RuleType.ONLY_ALLOWS,
      ifOption: {
        optionGroupId: 'cdf87374-cccd-489a-b907-554f494cbe0b',
      } as ProductOption,
    } as OptionRule;

    expect(
      isRuleValid(rule, [
        {
          id: 'baed87df-bfd2-416f-80aa-a8c8e3ee5991',
          optionGroupId: 'cdf87374-cccd-489a-b907-554f494cbe0b',
        } as ProductOption,
        {
          id: 'dc9510be-4117-4f85-977d-e09d5c1c76f2',
          optionGroupId: 'cdf87374-cccd-489a-b907-554f494cbe0b',
        } as ProductOption,
      ]),
    ).toBe(true);

    expect(
      isRuleValid(rule, [
        {
          id: 'baed87df-bfd2-416f-80aa-a8c8e3ee5991',
          optionGroupId: 'cdf87374-cccd-489a-b907-554f494cbe0b',
        } as ProductOption,
      ]),
    ).toBe(false);

    expect(
      isRuleValid(rule, [
        {
          id: 'baed87df-bfd2-416f-80aa-a8c8e3ee5991',
          optionGroupId: 'cdf87374-cccd-489a-b907-554f494cbe0b',
        } as ProductOption,
        {
          id: 'dc9510be-4117-4f85-977d-e09d5c1c76f2',
          optionGroupId: 'cdf87374-cccd-489a-b907-554f494cbe0b',
        } as ProductOption,
        {
          id: '3029276d-8b20-4420-b200-16f656775ed7',
          optionGroupId: 'cdf87374-cccd-489a-b907-554f494cbe0b',
        } as ProductOption,
      ]),
    ).toBe(false);

    expect(
      isRuleValid(rule, [
        {
          id: 'baed87df-bfd2-416f-80aa-a8c8e3ee5991',
          optionGroupId: 'cdf87374-cccd-489a-b907-554f494cbe0b',
        } as ProductOption,
        {
          id: 'dc9510be-4117-4f85-977d-e09d5c1c76f2',
          optionGroupId: 'cdf87374-cccd-489a-b907-554f494cbe0b',
        } as ProductOption,
        {
          id: '6c590aa6-a311-48ef-a7ed-c549a44223c0',
          optionGroupId: 'fb10097b-6541-4f32-99b8-9f38203f5d91',
        } as ProductOption,
      ]),
    ).toBe(true);

    expect(
      isRuleValid(rule, [
        {
          id: 'dc9510be-4117-4f85-977d-e09d5c1c76f2',
          optionGroupId: 'cdf87374-cccd-489a-b907-554f494cbe0b',
        } as ProductOption,
      ]),
    ).toBe(true);

    expect(isRuleValid(rule, [])).toBe(true);
  });

  it('should throw error for invalid rule type', () => {
    const rule = {
      ifOptionId: 'baed87df-bfd2-416f-80aa-a8c8e3ee5991',
      thenOptionId: 'dc9510be-4117-4f85-977d-e09d5c1c76f2',
      ruleType: 'UNEXISTENT' as RuleType,
    } as OptionRule;

    expect(() =>
      isRuleValid(rule, [
        { id: 'baed87df-bfd2-416f-80aa-a8c8e3ee5991' } as ProductOption,
      ]),
    ).toThrow(new LogicException('Unhandled rule type: UNEXISTENT'));
  });
});
