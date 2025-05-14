import { ProductOptionOutput } from '@Shop/types/product-option.output';
import { ProductOption } from '@Shop/entities/product-option.entity';
import { transformInventoryItem } from '@Shop/services/transfomers/inventory-item.transformer';
import { ProductOptionGroup } from '@Shop/entities/product-option-group.entity';
import { ProductOptionGroupOutput } from '@Shop/types/product-option-group.output';

function transformProductOptionGroup(
  productOptionGroup: ProductOptionGroup,
): ProductOptionGroupOutput {
  return {
    id: productOptionGroup.id,
    name: productOptionGroup.name,
    displayName: productOptionGroup.displayName,
    createdAt: productOptionGroup.createdAt.toISOString(),
    updatedAt: productOptionGroup.updatedAt.toISOString(),
  };
}

export function transformProductOption(
  productOption: ProductOption,
): ProductOptionOutput {
  return {
    id: productOption.id,
    name: productOption.name,
    displayName: productOption.displayName,
    basePrice: Number(Number(productOption.basePrice).toFixed(2)),
    ...(productOption.inventoryItem && {
      inventoryItem: transformInventoryItem(productOption.inventoryItem),
    }),
    ...(productOption.optionGroup && {
      optionGroup: transformProductOptionGroup(productOption.optionGroup),
    }),
    ...(productOption.optionGroupId && {
      optionGroupId: productOption.optionGroupId,
    }),
    isActive: productOption.isActive,
    createdAt: productOption.createdAt.toISOString(),
    updatedAt: productOption.updatedAt.toISOString(),
  };
}
