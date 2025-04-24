import { EntityManager } from 'typeorm';
import { CartItem } from '@Shop/entities/cart-item.entity';
import { Cart } from '@Shop/entities/cart.entity';
import { Product } from '@Shop/entities/product.entity';

export async function createCartItem(
  entityManager: EntityManager,
  cart: Cart,
  product: Product,
  override: Partial<CartItem> = {},
): Promise<CartItem> {
  const cartItem = entityManager.create(CartItem, {
    cart,
    cartId: cart.id,
    product,
    productId: product.id,
    quantity: 1,
    ...override,
  });

  await entityManager.save(cartItem);

  return cartItem;
}
