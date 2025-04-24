import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '@Shop/entities/cart.entity';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async reload(cart: Cart): Promise<Cart> {
    return this.cartRepository.findOneOrFail({
      where: {
        id: cart.id,
      },
      relations: [
        'items',
        'items.product',
        'items.itemOptions',
        'items.itemOptions.option',
      ],
    });
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { userId },
      relations: [
        'items',
        'items.product',
        'items.itemOptions',
        'items.itemOptions.option',
      ],
    });
  }
}
