import { transformProductOption } from '@Shop/services/transfomers/product-option.transform';
import { InventoryStatusForProduct } from '@Shop/types/inventory-status-for-product';
import { transformProduct } from '@Shop/services/transfomers/product.transformer';
import { ProductOptionGroup } from '../../entities/product-option-group.entity';
import { ProductOptionGroupOutput } from '../../types/product-option-group.output';

export function transformProductOptionGroup(
  productOptionGroup: ProductOptionGroup,
  optionInventory?: InventoryStatusForProduct[],
): ProductOptionGroupOutput {
  return {
    id: productOptionGroup.id,
    name: productOptionGroup.name,
    displayName: productOptionGroup.displayName,
    ...(productOptionGroup.options && {
      options: productOptionGroup.options.map((option) =>
        transformProductOption(option, optionInventory),
      ),
    }),
    ...(productOptionGroup.product && {
      product: transformProduct(productOptionGroup.product, optionInventory),
    }),
    createdAt: productOptionGroup.createdAt.toISOString(),
    updatedAt: productOptionGroup.updatedAt.toISOString(),
  };
}
