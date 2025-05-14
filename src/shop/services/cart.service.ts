import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CartItemOption } from '@Shop/entities/cart-item-option.entity';
import { CartItem } from '@Shop/entities/cart-item.entity';
import { Cart } from '@Shop/entities/cart.entity';
import { User } from '@User/entities/user.entity';
import { EntityManager } from 'typeorm';
import { UpdateQuantityInput } from '@Shop/types/update-quantity.input';
import { ProductOptionRepository } from '@Shop/repositories/product-option.repository';
import { ProductsService } from '@Shop/services/products.service';
import { CartRepository } from '@Shop/repositories/cart.repository';
import { CartItemRepository } from '@Shop/repositories/cart-item.repository';
import { ProductRepository } from '@Shop/repositories/product.repository';
import { AddToCartInput } from '@Shop/types/add-to-cart.input';
import { OptionRulesService } from './option-rules.service';

@Injectable()
export class CartService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly cartRepository: CartRepository,
    private readonly optionRulesService: OptionRulesService,
    private readonly productsService: ProductsService,
    private readonly productOptionRepository: ProductOptionRepository,
    private readonly cartItemRepository: CartItemRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async getCart(user: User): Promise<Cart> {
    const cart = await this.cartRepository.findByUserId(user.id);

    if (!cart) {
      const newCart = this.entityManager.create(Cart, {
        userId: user.id,
        totalPrice: 0,
      });
      await this.entityManager.save(newCart);

      newCart.totalPrice = 0;

      return newCart;
    }

    return cart;
  }

  async addItem(user: User, input: AddToCartInput): Promise<Cart> {
    const { productId, quantity, optionIds } = input;

    let cart = await this.cartRepository.findByUserId(user.id);

    if (!cart) {
      cart = this.entityManager.create(Cart, {
        userId: user.id,
        totalPrice: 0,
      });
      await this.entityManager.save(cart);

      cart.totalPrice = 0;
    }

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException(
        `Product with ID ${productId} not found or not active.`,
      );
    }

    if (optionIds.length <= 0) {
      throw new BadRequestException('No options selected for the product.');
    }

    const isValid = await this.optionRulesService.validateConfiguration(
      productId,
      optionIds,
    );

    if (!isValid) {
      throw new BadRequestException(
        'One or more selected options are invalid.',
      );
    }

    const existingItem = await this.cartItemRepository.findExistingCartItem(
      cart.id,
      productId,
      optionIds,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      await this.entityManager.save(existingItem);
    } else {
      const validOptions =
        await this.productOptionRepository.findAllByIds(optionIds);

      const newItem = this.entityManager.create(CartItem, {
        cartId: cart.id,
        productId,
        quantity,
        price: 0,
        totalPrice: 0,
        itemOptions: [],
      });
      await this.entityManager.save(newItem);

      for (const option of validOptions) {
        const cartItemOption = this.entityManager.create(CartItemOption, {
          cartItemId: newItem.id,
          optionId: option.id,
          price: 0,
        });

        await this.entityManager.save(cartItemOption);
      }
    }

    return this.calculateCartPrice(await this.cartRepository.reload(cart));
  }

  async removeItem(user: User, cartItemId: string): Promise<Cart> {
    const cart = await this.cartRepository.findByUserId(user.id);

    if (!cart) {
      throw new NotFoundException('Cart not found for this user.');
    }

    const itemToRemove = await this.cartItemRepository.findByCartItemAndCart(
      cartItemId,
      cart.id,
    );

    if (!itemToRemove) {
      throw new NotFoundException(
        `Cart item with ID ${cartItemId} not found in your cart.`,
      );
    }

    await this.entityManager.remove(itemToRemove);

    return this.calculateCartPrice(await this.cartRepository.reload(cart));
  }

  async updateItemQuantity(
    user: User,
    cartItemId: string,
    input: UpdateQuantityInput,
  ): Promise<Cart> {
    const { quantity } = input;
    if (quantity <= 0) {
      return this.removeItem(user, cartItemId);
    }

    const cart = await this.cartRepository.findByUserId(user.id);

    if (!cart) {
      throw new NotFoundException('Cart not found for this user.');
    }

    const itemToUpdate = await this.cartItemRepository.findByCartItemAndCart(
      cartItemId,
      cart.id,
    );

    if (!itemToUpdate) {
      throw new NotFoundException(
        `Cart item with ID ${cartItemId} not found in your cart.`,
      );
    }

    itemToUpdate.quantity = quantity;
    await this.entityManager.save(itemToUpdate);

    return this.calculateCartPrice(await this.cartRepository.reload(cart));
  }

  private async calculateCartPrice(cart: Cart): Promise<Cart> {
    let cartTotalPrice = 0;
    let cartItemPrice = 0;
    let cartItemTotalPrice = 0;

    for (const cartItem of cart.items) {
      const product = await this.productsService.getByIdAndOptions(
        cartItem.productId,
        cartItem.itemOptions.map((itemOption) => itemOption.optionId),
      );

      let productTotalPrice = Number(product.basePrice);
      for (const cartItemOption of cartItem.itemOptions) {
        const option = product.optionGroups
          .flatMap((g) => g.options)
          .find((o) => o.id === cartItemOption.optionId);

        if (option) {
          cartItemOption.option = option;
          productTotalPrice += Number(option.basePrice);

          this.entityManager.merge(CartItemOption, cartItemOption, {
            price: option.basePrice,
          });
          await this.entityManager.save(cartItem);
        }
      }

      const itemTotalPrice = productTotalPrice * cartItem.quantity;

      cartItemPrice = Number(productTotalPrice.toFixed(2));
      cartItemTotalPrice = Number(itemTotalPrice.toFixed(2));
      cartTotalPrice += Number(itemTotalPrice.toFixed(2));

      this.entityManager.merge(CartItem, cartItem, {
        price: cartItemPrice,
        totalPrice: cartItemTotalPrice,
      });
      await this.entityManager.save(cartItem);
    }

    this.entityManager.merge(Cart, cart, {
      totalPrice: cartTotalPrice,
    });
    return this.entityManager.save(cart);
  }
}
