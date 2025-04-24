import { EntityManager } from 'typeorm';
import { Cart } from '@Shop/entities/cart.entity';
import { User } from '@User/entities/user.entity';

export async function createCart(
  entityManager: EntityManager,
  user: User,
  override: Partial<Cart> = {},
): Promise<Cart> {
  const cart = entityManager.create(Cart, {
    user,
    ...override,
  });

  await entityManager.save(cart);

  return cart;
}
