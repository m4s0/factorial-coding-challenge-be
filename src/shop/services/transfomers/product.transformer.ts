import { ProductOption } from '@Shop/entities/product-option.entity';
import { ProductOptionGroup } from '@Shop/entities/product-option-group.entity';
import { OptionRule } from '@Shop/entities/option-rule.entity';
import { OptionRuleOutput } from '@Shop/types/option-rule.output';
import { ProductOptionOutput } from '@Shop/types/product-option.output';
import { ProductOptionGroupOutput } from '@Shop/types/product-option-group.output';
import { ProductOutput } from '@Shop/types/product.output';
import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { OptionPriceRuleOutput } from '@Shop/types/option-price-rule.output';
import { InventoryItem } from '@Shop/entities/inventory-item.entity';
import { InventoryItemOutput } from '@Shop/types/inventory-item.output';
import { transformProductCategory } from '@Shop/services/transfomers/product-category.transformer';
import { Product } from '../../entities/product.entity';

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

function transformInventoryItem(
  inventoryItem: InventoryItem,
): InventoryItemOutput {
  return {
    id: inventoryItem.id,
    quantity: inventoryItem.quantity,
    outOfStock: inventoryItem.outOfStock,
    productOptionId: inventoryItem.productOptionId,
    createdAt: inventoryItem.createdAt.toISOString(),
    updatedAt: inventoryItem.updatedAt.toISOString(),
  };
}

function transformProductOption(
  productOption: ProductOption,
  inventoryItem?: InventoryItem,
): ProductOptionOutput {
  return {
    id: productOption.id,
    name: productOption.name,
    displayName: productOption.displayName,
    basePrice: Number(Number(Number(productOption.basePrice).toFixed(2))),
    isActive: productOption.isActive,
    ...(productOption.inventoryItem && {
      inventoryItem: transformInventoryItem(productOption.inventoryItem),
    }),
    ...(productOption.rulesAsCondition && {
      rulesAsCondition: productOption.rulesAsCondition.map((rule) =>
        transformOptionRule(rule),
      ),
    }),
    ...(productOption.rulesAsResult && {
      rulesAsResult: productOption.rulesAsResult.map((rule) =>
        transformOptionRule(rule),
      ),
    }),
    ...(productOption.priceRules && {
      priceRules: productOption.priceRules.map((rule) =>
        transformOptionPriceRule(rule),
      ),
    }),
    createdAt: productOption.createdAt.toISOString(),
    updatedAt: productOption.updatedAt.toISOString(),
    ...(inventoryItem && {
      inStock: !inventoryItem.outOfStock,
    }),
  };
}

function transformProductOptionGroup(
  productOptionGroup: ProductOptionGroup,
  inventoryItem?: InventoryItem,
): ProductOptionGroupOutput {
  return {
    id: productOptionGroup.id,
    name: productOptionGroup.name,
    displayName: productOptionGroup.displayName,
    options: productOptionGroup.options.map((productOption) => {
      return transformProductOption(productOption, inventoryItem);
    }),
    createdAt: productOptionGroup.createdAt.toISOString(),
    updatedAt: productOptionGroup.updatedAt.toISOString(),
  };
}

export function transformProduct(
  product: Product,
  inventoryItem?: InventoryItem,
  isValidConfiguration?: boolean,
  price?: number,
): ProductOutput {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    basePrice: Number(Number(Number(product.basePrice).toFixed(2))),
    isActive: product.isActive,
    categoryId: product.categoryId,
    ...(product.category && {
      category: transformProductCategory(product.category),
    }),
    ...(product.optionGroups && {
      optionGroups: product.optionGroups.map((productOptionGroup) => {
        return transformProductOptionGroup(productOptionGroup, inventoryItem);
      }),
    }),
    ...(isValidConfiguration !== undefined && {
      isValidConfiguration,
    }),
    ...(price !== undefined && { price }),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}
