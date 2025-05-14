import { RuleType } from '@Shop/entities/rule-type';

export type UpdateOptionRuleInput = {
  ifOptionId?: string;
  thenOptionId?: string;
  ruleType?: RuleType;
};
