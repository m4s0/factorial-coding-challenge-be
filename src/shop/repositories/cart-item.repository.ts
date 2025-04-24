import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from '@Shop/entities/cart-item.entity';

@Injectable()
export class CartItemRepository {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  async findExistingCartItem(
    cartId: string,
    productId: string,
    optionIds: string[],
  ): Promise<CartItem | null> {
    const queryBuilder = this.cartItemRepository
      .createQueryBuilder('cartItem')
      .leftJoin('cartItem.itemOptions', 'itemOptions')
      .leftJoin('itemOptions.option', 'option')
      .where('cartItem.cartId = :cartId', { cartId })
      .andWhere('cartItem.productId = :productId', { productId })
      .groupBy('cartItem.id')
      .having('COUNT(option.id) = :optionCount', {
        optionCount: optionIds.length,
      });

    if (optionIds.length > 0) {
      queryBuilder.andHaving(
        'SUM(CASE WHEN option.id IN (:...selectedOptionIds) THEN 1 ELSE 0 END) = :optionCount',
        { selectedOptionIds: optionIds },
      );
    }

    return queryBuilder.getOne();
  }

  async findByCartItemAndCart(
    cartItemId: string,
    cartId: string,
  ): Promise<CartItem | null> {
    return this.cartItemRepository.findOne({
      where: { id: cartItemId, cartId },
    });
  }
}
