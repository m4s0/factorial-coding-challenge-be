import { RuleType } from '../entities/rule-type';
import { ProductOptionOutput } from './product-option.output';

export type OptionRuleOutput = {
  id: string;
  ruleType: RuleType;
  ifOptionId: string;
  ifOption?: ProductOptionOutput;
  thenOptionId: string;
  thenOption?: ProductOptionOutput;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
