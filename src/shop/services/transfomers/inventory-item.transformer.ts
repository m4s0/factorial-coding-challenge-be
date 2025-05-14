import { InventoryItem } from '@Shop/entities/inventory-item.entity';
import { InventoryItemOutput } from '@Shop/types/inventory-item.output';
import { ProductOption } from '@Shop/entities/product-option.entity';
import { InventoryStatusForProduct } from '@Shop/types/inventory-status-for-product';
import { ProductOptionOutput } from '@Shop/types/product-option.output';
import { OptionRule } from '@Shop/entities/option-rule.entity';
import { OptionRuleOutput } from '@Shop/types/option-rule.output';
import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { OptionPriceRuleOutput } from '@Shop/types/option-price-rule.output';

function transformOptionPriceRule(
  optionPriceRule: OptionPriceRule,
): OptionPriceRuleOutput {
  return {
    id: optionPriceRule.id,
    price: Number(optionPriceRule.price.toFixed(2)),
    targetOptionId: optionPriceRule.targetOptionId,
    dependentOptionId: optionPriceRule.dependentOptionId,
    isActive: optionPriceRule.isActive,
    createdAt: optionPriceRule.createdAt.toISOString(),
    updatedAt: optionPriceRule.updatedAt.toISOString(),
  };
}

function transformOptionRule(optionRule: OptionRule): OptionRuleOutput {
  return {
    id: optionRule.id,
    ruleType: optionRule.ruleType,
    ifOptionId: optionRule.ifOptionId,
    thenOptionId: optionRule.thenOptionId,
    isActive: optionRule.isActive,
    createdAt: optionRule.createdAt.toISOString(),
    updatedAt: optionRule.updatedAt.toISOString(),
  };
}

function transformProductOption(
  productOption: ProductOption,
  optionInventory?: InventoryStatusForProduct[],
): ProductOptionOutput {
  return {
    id: productOption.id,
    name: productOption.name,
    displayName: productOption.displayName,
    basePrice: Number(Number(productOption.basePrice).toFixed(2)),
    isActive: productOption.isActive,
    rulesAsCondition: productOption.rulesAsCondition.map((optionRule) => {
      return transformOptionRule(optionRule);
    }),
    rulesAsResult: productOption.rulesAsResult.map((optionRule) => {
      return transformOptionRule(optionRule);
    }),
    priceRules: productOption.priceRules.map((optionPriceRule) => {
      return transformOptionPriceRule(optionPriceRule);
    }),
    createdAt: productOption.createdAt.toISOString(),
    updatedAt: productOption.updatedAt.toISOString(),
    ...(optionInventory && {
      inStock:
        optionInventory.find((inv) => inv.productOptionId === productOption.id)
          ?.inStock || false,
    }),
  };
}

export function transformInventoryItem(
  inventoryItem: InventoryItem,
): InventoryItemOutput {
  return {
    id: inventoryItem.id,
    quantity: inventoryItem.quantity,
    outOfStock: inventoryItem.outOfStock,
    productOptionId: inventoryItem.productOptionId,
    ...(inventoryItem.productOption && {
      productOption: transformProductOption(inventoryItem.productOption),
    }),
    createdAt: inventoryItem.createdAt.toISOString(),
    updatedAt: inventoryItem.updatedAt.toISOString(),
  };
}
