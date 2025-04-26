export type CreateOptionPriceRuleInput = {
  price: number;
  targetOptionId: string;
  dependentOptionId: string;
  isActive: boolean;
};
