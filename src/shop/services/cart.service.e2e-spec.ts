import { INestApplication } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { createUUID } from '@Common/utils/create-uuid';
import { CartService } from '@Shop/services/cart.service';
import { createCartItem } from '../../../test/helpers/create-cart-item';
import { createCartItemOption } from '../../../test/helpers/create-cart-item-option';
import { createTestApp } from '../../../test/create-test.app';
import { createUser } from '../../../test/helpers/create-user';
import { createProductCategory } from '../../../test/helpers/create-product-category';
import { createProduct } from '../../../test/helpers/create-product';
import { createProductOptionGroup } from '../../../test/helpers/create-product-option-group';
import { createProductOption } from '../../../test/helpers/create-product-option';
import { createCart } from '../../../test/helpers/create-cart';
import { createInventoryItem } from '../../../test/helpers/create-inventory-item';

describe('CartService', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let cartService: CartService;

  beforeAll(async () => {
    app = await createTestApp();
    entityManager = app.get<EntityManager>(EntityManager);
    cartService = app.get<CartService>(CartService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('getCart', () => {
    it('should get an existing cart for user', async () => {
      const user = await createUser(entityManager);
      const category = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: category.id,
      });

      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option = await createProductOption(entityManager, optionGroup);
      await createInventoryItem(entityManager, {
        productOptionId: option.id,
        quantity: 10,
        outOfStock: false,
      });

      const cart = await createCart(entityManager, user);
      const cartItem = await createCartItem(entityManager, cart, product);
      const cartItemOption = await createCartItemOption(
        entityManager,
        cartItem,
        option,
      );

      const result = await cartService.getCart(user);

      expect(result).toMatchObject({
        id: cart.id,
        userId: user.id,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        items: [
          {
            id: cartItem.id,
            cartId: cart.id,
            productId: product.id,
            quantity: 1,
            price: 83.98,
            totalPrice: 83.98,
            createdAt: cartItem.createdAt,
            updatedAt: cartItem.updatedAt,
            product: {
              id: product.id,
              name: product.name,
              description: product.description,
              basePrice: product.basePrice.toString(),
              isActive: product.isActive,
              categoryId: category.id,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt,
            },
            itemOptions: [
              {
                id: cartItemOption.id,
                cartItemId: cartItem.id,
                optionId: option.id,
                createdAt: cartItemOption.createdAt,
                updatedAt: cartItemOption.updatedAt,
                option: {
                  id: option.id,
                  name: option.name,
                  displayName: option.displayName,
                  basePrice: option.basePrice.toString(),
                  isActive: option.isActive,
                  optionGroupId: optionGroup.id,
                  createdAt: option.createdAt,
                  updatedAt: option.updatedAt,
                },
              },
            ],
          },
        ],
        totalPrice: 83.98,
      });
    });

    it('should create a new cart for user if none exists', async () => {
      const user = await createUser(entityManager);
      const cart = await cartService.getCart(user);

      expect(cart).toMatchObject({
        id: expect.any(String),
        userId: user.id,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        totalPrice: 0,
      });
    });
  });

  describe('addItem', () => {
    it('should add item to cart with options', async () => {
      const user = await createUser(entityManager);
      const category = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: category.id,
      });

      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option = await createProductOption(entityManager, optionGroup);
      await createInventoryItem(entityManager, {
        productOptionId: option.id,
        quantity: 10,
        outOfStock: false,
      });
      const cart = await createCart(entityManager, user);

      const addToCartInput = {
        productId: product.id,
        quantity: 2,
        optionIds: [option.id],
      };

      const result = await cartService.addItem(user, addToCartInput);

      expect(result).toMatchObject({
        id: cart.id,
        userId: user.id,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        totalPrice: 167.96,
        items: [
          {
            id: expect.any(String),
            cartId: cart.id,
            productId: product.id,
            quantity: 2,
            price: 83.98,
            totalPrice: 167.96,
            itemOptions: [
              {
                id: expect.any(String),
                cartItemId: expect.any(String),
                optionId: option.id,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
              },
            ],
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          },
        ],
      });
    });

    it('should throw NotFoundException for non-existent product', async () => {
      const user = await createUser(entityManager);
      const nonExistentId = createUUID();

      await expect(
        cartService.addItem(user, {
          productId: nonExistentId,
          quantity: 1,
          optionIds: [createUUID()],
        }),
      ).rejects.toThrow(
        `Product with ID ${nonExistentId} not found or not active.`,
      );
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      const user = await createUser(entityManager);
      const category = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: category.id,
      });

      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option = await createProductOption(entityManager, optionGroup);
      await createInventoryItem(entityManager, {
        productOptionId: option.id,
        quantity: 10,
        outOfStock: false,
      });

      const cart = await createCart(entityManager, user);
      const cartItem = await createCartItem(entityManager, cart, product);
      await createCartItemOption(entityManager, cartItem, option);

      const result = await cartService.removeItem(user, cartItem.id);

      expect(result.items).toHaveLength(0);
    });

    it('should throw NotFoundException for non-existent cart', async () => {
      const user = await createUser(entityManager);
      const nonExistentId = createUUID();

      await expect(cartService.removeItem(user, nonExistentId)).rejects.toThrow(
        'Cart not found for this user.',
      );
    });

    it('should throw NotFoundException for non-existent cart item', async () => {
      const user = await createUser(entityManager);
      await createCart(entityManager, user);

      const nonExistentId = createUUID();

      await expect(cartService.removeItem(user, nonExistentId)).rejects.toThrow(
        `Cart item with ID ${nonExistentId} not found in your cart.`,
      );
    });
  });

  describe('updateItemQuantity', () => {
    it('should update item quantity', async () => {
      const user = await createUser(entityManager);
      const category = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: category.id,
      });

      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option = await createProductOption(entityManager, optionGroup);
      await createInventoryItem(entityManager, {
        productOptionId: option.id,
        quantity: 10,
        outOfStock: false,
      });

      const cart = await createCart(entityManager, user);
      const cartItem = await createCartItem(entityManager, cart, product);
      await createCartItemOption(entityManager, cartItem, option);

      const result = await cartService.updateItemQuantity(user, cartItem.id, {
        quantity: 3,
      });

      expect(result).toMatchObject({
        items: [
          {
            quantity: 3,
            price: 83.98,
            totalPrice: 251.94,
          },
        ],
        totalPrice: 251.94,
      });
    });

    it('should remove item when quantity is set to 0', async () => {
      const user = await createUser(entityManager);
      const category = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: category.id,
      });

      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option = await createProductOption(entityManager, optionGroup);
      await createInventoryItem(entityManager, {
        productOptionId: option.id,
        quantity: 10,
        outOfStock: false,
      });

      const cart = await createCart(entityManager, user);
      const cartItem = await createCartItem(entityManager, cart, product);
      await createCartItemOption(entityManager, cartItem, option);

      const result = await cartService.updateItemQuantity(user, cartItem.id, {
        quantity: 0,
      });

      expect(result).toMatchObject({
        items: [],
        totalPrice: 0,
      });
    });
  });
});
