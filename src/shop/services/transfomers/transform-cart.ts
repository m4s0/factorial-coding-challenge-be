import { Cart } from '@Shop/entities/cart.entity';
import { CartOutput } from '@Shop/types/cart.output';

export function transformCart(cart: Cart): CartOutput {
  return {
    id: cart.id,
    totalPrice: Number(cart.totalPrice ?? 0),
    createdAt: cart.createdAt.toISOString(),
    updatedAt: cart.updatedAt.toISOString(),
    items: cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      price: Number(item.price ?? 0),
      totalPrice: Number(item.totalPrice ?? 0),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: Number(item.product.basePrice),
        categoryId: item.product.categoryId,
        createdAt: item.product.createdAt.toISOString(),
        updatedAt: item.product.updatedAt.toISOString(),
      },
      itemOptions: item.itemOptions.map((itemOption) => ({
        id: itemOption.id,
        createdAt: itemOption.createdAt.toISOString(),
        updatedAt: itemOption.updatedAt.toISOString(),
        optionId: itemOption.optionId,
        option: {
          id: itemOption.option.id,
          name: itemOption.option.name,
          displayName: itemOption.option.displayName,
          price: Number(itemOption.option.basePrice),
          optionGroupId: itemOption.option.optionGroupId,
          createdAt: itemOption.option.createdAt.toISOString(),
          updatedAt: itemOption.option.updatedAt.toISOString(),
        },
      })),
    })),
  };
}
