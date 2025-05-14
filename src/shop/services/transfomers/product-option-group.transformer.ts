import { ProductOption } from '@Shop/entities/product-option.entity';
import { Product } from '@Shop/entities/product.entity';
import { transformOptionRule } from '@Shop/services/transfomers/option-rule.transformer';
import { ProductOptionOutput } from '@Shop/types/product-option.output';
import { ProductOutput } from '@Shop/types/product.output';
import { ProductOptionGroup } from '../../entities/product-option-group.entity';
import { ProductOptionGroupOutput } from '../../types/product-option-group.output';
import { transformInventoryItem } from './inventory-item.transformer';
import { transformOptionPriceRule } from './option-price-rule.transformer';

function transformProductOption(
  productOption: ProductOption,
): ProductOptionOutput {
  return {
    id: productOption.id,
    name: productOption.name,
    displayName: productOption.displayName,
    basePrice: Number(Number(productOption.basePrice).toFixed(2)),
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
  };
}

function transformProduct(product: Product): ProductOutput {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    basePrice: Number(Number(product.basePrice).toFixed(2)),
    isActive: product.isActive,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function transformProductOptionGroup(
  productOptionGroup: ProductOptionGroup,
): ProductOptionGroupOutput {
  return {
    id: productOptionGroup.id,
    name: productOptionGroup.name,
    displayName: productOptionGroup.displayName,
    options: productOptionGroup.options.map((option) =>
      transformProductOption(option),
    ),
    ...(productOptionGroup.product && {
      product: transformProduct(productOptionGroup.product),
    }),
    ...(productOptionGroup.productId && {
      productId: productOptionGroup.productId,
    }),
    createdAt: productOptionGroup.createdAt.toISOString(),
    updatedAt: productOptionGroup.updatedAt.toISOString(),
  };
}
