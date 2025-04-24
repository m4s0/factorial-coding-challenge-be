import { EntityManager } from 'typeorm';
import { CartItem } from '@Shop/entities/cart-item.entity';
import { ProductOption } from '@Shop/entities/product-option.entity';
import { CartItemOption } from '@Shop/entities/cart-item-option.entity';

export async function createCartItemOption(
  entityManager: EntityManager,
  cartItem: CartItem,
  option: ProductOption,
  override: Partial<CartItemOption> = {},
): Promise<CartItemOption> {
  const cartItemOption = entityManager.create(CartItemOption, {
    cartItem,
    cartItemId: cartItem.id,
    option,
    optionId: option.id,
    name: option.name,
    displayName: option.displayName,
    basePrice: option.basePrice,
    ...override,
  });

  await entityManager.save(cartItemOption);

  return cartItemOption;
}
