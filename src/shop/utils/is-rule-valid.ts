import { OptionRule } from '@Shop/entities/option-rule.entity';
import { RuleType } from '@Shop/entities/rule-type';
import { LogicException } from '@Common/exceptions/logic-exception';
import { ProductOption } from '@Shop/entities/product-option.entity';

export function isRuleValid(rule: OptionRule, options: ProductOption[]) {
  const ifOptionSelected = options.some(
    (option) => option.id === rule.ifOptionId,
  );
  const thenOptionSelected = options.some(
    (option) => option.id === rule.thenOptionId,
  );

  switch (rule.ruleType) {
    case RuleType.REQUIRES:
      return !ifOptionSelected || thenOptionSelected;

    case RuleType.EXCLUDES:
      return !ifOptionSelected || !thenOptionSelected;

    case RuleType.ONLY_ALLOWS:
      if (!ifOptionSelected) {
        return true;
      }

      const thenOption = options.find(
        (option) => option.id === rule.thenOptionId,
      );

      if (!thenOption) {
        return false;
      }

      const thenOptionsBelongingToSameGroup = options.filter(
        (option) => option.optionGroupId === thenOption.optionGroupId,
      );

      const otherOptionsSelected = thenOptionsBelongingToSameGroup.filter(
        (option) =>
          option.id !== rule.ifOptionId && option.id !== rule.thenOptionId,
      );

      return thenOptionSelected && otherOptionsSelected.length === 0;

    default:
      throw new LogicException(`Unhandled rule type: ${String(rule.ruleType)}`);
  }
}
