import { RuleType } from '@Shop/entities/rule-type';

export type CreateOptionRuleInput = {
  ifOptionId: string;
  thenOptionId: string;
  ruleType: RuleType;
};
