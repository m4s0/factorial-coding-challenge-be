import { ProductOptionOutput } from '@Shop/types/product-option.output';
import { ProductOption } from '@Shop/entities/product-option.entity';
import { transformInventoryItem } from '@Shop/services/transfomers/inventory-item.transformer';
import { transformOptionRule } from '@Shop/services/transfomers/option-rule.transformer';
import { transformOptionPriceRule } from '@Shop/services/transfomers/option-price-rule.transformer';
import { transformProductOptionGroup } from '@Shop/services/transfomers/product-option-group.transformer';
import { InventoryStatusForProduct } from '@Shop/types/inventory-status-for-product';

export function transformProductOption(
  option: ProductOption,
  optionInventory?: InventoryStatusForProduct[],
): ProductOptionOutput {
  return {
    id: option.id,
    name: option.name,
    displayName: option.displayName,
    basePrice: option.basePrice ? option.basePrice : null,
    isActive: option.isActive,
    optionGroupId: option.optionGroupId,
    ...(option.optionGroup && {
      optionGroup: transformProductOptionGroup(option.optionGroup),
    }),
    ...(option.inventoryItems && {
      inventoryItems: option.inventoryItems.map((item) =>
        transformInventoryItem(item),
      ),
    }),
    ...(option.rulesAsCondition && {
      rulesAsCondition: option.rulesAsCondition.map((rule) =>
        transformOptionRule(rule),
      ),
    }),
    ...(option.rulesAsResult && {
      rulesAsResult: option.rulesAsResult.map((rule) =>
        transformOptionRule(rule),
      ),
    }),
    ...(option.priceRules && {
      priceRules: option.priceRules.map((rule) =>
        transformOptionPriceRule(rule),
      ),
    }),
    ...(option.createdAt && {
      createdAt: option.createdAt.toISOString(),
    }),
    ...(option.updatedAt && {
      updatedAt: option.updatedAt.toISOString(),
    }),
    ...(optionInventory && {
      inStock:
        optionInventory.find((inv) => inv.productOptionId === option.id)
          ?.inStock || false,
    }),
  };
}
