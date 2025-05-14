import { HttpStatus, INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import request from 'supertest';
import { CartService } from '@Shop/services/cart.service';
import { CartItem } from '@Shop/entities/cart-item.entity';
import { createUUID } from '@Common/utils/create-uuid';
import { Cart } from '@Shop/entities/cart.entity';
import { Product } from '@Shop/entities/product.entity';
import { CartItemOption } from '@Shop/entities/cart-item-option.entity';
import { createMockUser } from '../../../test/mocks/guards/create-mock-user';
import { createTestApp } from '../../../test/create-test.app';

describe('CartController', () => {
  let app: INestApplication<App>;
  let cartService: CartService;
  const mockUser = createMockUser();
  const mockCart = {
    id: '1fd7b09c-6da1-4f84-afe5-9ab0117c4cab',
    totalPrice: 835.0,
    user: mockUser,
    userId: '3e626cc9-9368-4b62-984b-bb94b1e58794',
    createdAt: new Date('2024-03-15T10:00:00Z'),
    updatedAt: new Date('2024-03-15T10:00:00Z'),
    items: [
      {
        id: 'a87f1507-55f5-41e1-b66e-34b245dd3e00',
        cart: {} as Cart,
        cartId: '1fd7b09c-6da1-4f84-afe5-9ab0117c4cab',
        productId: '09e51e85-e64e-4b40-a5d5-d791dfdcdd2a',
        quantity: 1,
        price: 835.0,
        totalPrice: 835.0,
        createdAt: new Date('2024-03-15T10:00:00Z'),
        updatedAt: new Date('2024-03-15T10:00:00Z'),
        product: {
          id: '09e51e85-e64e-4b40-a5d5-d791dfdcdd2a',
          name: 'Trailblazer Pro',
          description:
            'High-performance mountain bike for serious trail riders',
          basePrice: 800.0,
          categoryId: '3fee385c-8b66-4571-9d24-4c18e9223515',
          createdAt: new Date('2024-03-15T10:00:00Z'),
          updatedAt: new Date('2024-03-15T10:00:00Z'),
        } as Product,
        itemOptions: [
          {
            id: '1db5f36b-d590-4334-83db-0004701f8965',
            createdAt: new Date('2024-03-15T10:00:00Z'),
            updatedAt: new Date('2024-03-15T10:00:00Z'),
            optionId: '195aa790-a520-444b-95c2-f6c5f4cf63b1',
            option: {
              id: '195aa790-a520-444b-95c2-f6c5f4cf63b1',
              name: 'matte',
              displayName: 'Matte',
              basePrice: 35.0,
              optionGroupId: 'a95635bd-fd69-44b7-8f63-cab9fbaacbf1',
              createdAt: new Date('2024-03-15T10:00:00Z'),
              updatedAt: new Date('2024-03-15T10:00:00Z'),
            },
          } as CartItemOption,
        ],
      } as CartItem,
    ],
  };

  beforeEach(async () => {
    app = await createTestApp();

    cartService = app.get<CartService>(CartService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /cart', () => {
    it('should return user cart', async () => {
      jest.spyOn(CartService.prototype, 'getCart').mockResolvedValue(mockCart);

      const response = await request(app.getHttpServer()).get('/cart');

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: '1fd7b09c-6da1-4f84-afe5-9ab0117c4cab',
        totalPrice: 835,
        createdAt: '2024-03-15T10:00:00.000Z',
        updatedAt: '2024-03-15T10:00:00.000Z',
        items: [
          {
            id: 'a87f1507-55f5-41e1-b66e-34b245dd3e00',
            productId: '09e51e85-e64e-4b40-a5d5-d791dfdcdd2a',
            quantity: 1,
            price: 835,
            totalPrice: 835,
            createdAt: '2024-03-15T10:00:00.000Z',
            updatedAt: '2024-03-15T10:00:00.000Z',
            product: {
              id: '09e51e85-e64e-4b40-a5d5-d791dfdcdd2a',
              name: 'Trailblazer Pro',
              description:
                'High-performance mountain bike for serious trail riders',
              price: 800,
              categoryId: '3fee385c-8b66-4571-9d24-4c18e9223515',
              createdAt: '2024-03-15T10:00:00.000Z',
              updatedAt: '2024-03-15T10:00:00.000Z',
            },
            itemOptions: [
              {
                id: '1db5f36b-d590-4334-83db-0004701f8965',
                createdAt: '2024-03-15T10:00:00.000Z',
                updatedAt: '2024-03-15T10:00:00.000Z',
                optionId: '195aa790-a520-444b-95c2-f6c5f4cf63b1',
                option: {
                  id: '195aa790-a520-444b-95c2-f6c5f4cf63b1',
                  name: 'matte',
                  displayName: 'Matte',
                  price: 35,
                  optionGroupId: 'a95635bd-fd69-44b7-8f63-cab9fbaacbf1',
                  createdAt: '2024-03-15T10:00:00.000Z',
                  updatedAt: '2024-03-15T10:00:00.000Z',
                },
              },
            ],
          },
        ],
      });
      expect(cartService.getCart).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('POST /cart/items', () => {
    it('should add item to cart', async () => {
      jest.spyOn(CartService.prototype, 'addItem').mockResolvedValue(mockCart);

      const addItemDto = {
        productId: '11ac9180-2200-4ac6-aa87-74ec75f7b425',
        quantity: 1,
        optionIds: [
          'e6da9da0-b13a-46c6-b121-a43741ca10e0',
          'e6f7eea5-b787-4fdc-8102-32ff7dde053f',
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/cart/items')
        .send(addItemDto);

      expect(response.statusCode).toEqual(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        id: '1fd7b09c-6da1-4f84-afe5-9ab0117c4cab',
        totalPrice: 835,
        createdAt: '2024-03-15T10:00:00.000Z',
        updatedAt: '2024-03-15T10:00:00.000Z',
        items: [
          {
            id: 'a87f1507-55f5-41e1-b66e-34b245dd3e00',
            productId: '09e51e85-e64e-4b40-a5d5-d791dfdcdd2a',
            quantity: 1,
            price: 835,
            totalPrice: 835,
            createdAt: '2024-03-15T10:00:00.000Z',
            updatedAt: '2024-03-15T10:00:00.000Z',
            product: {
              id: '09e51e85-e64e-4b40-a5d5-d791dfdcdd2a',
              name: 'Trailblazer Pro',
              description:
                'High-performance mountain bike for serious trail riders',
              price: 800,
              categoryId: '3fee385c-8b66-4571-9d24-4c18e9223515',
              createdAt: '2024-03-15T10:00:00.000Z',
              updatedAt: '2024-03-15T10:00:00.000Z',
            },
            itemOptions: [
              {
                id: '1db5f36b-d590-4334-83db-0004701f8965',
                createdAt: '2024-03-15T10:00:00.000Z',
                updatedAt: '2024-03-15T10:00:00.000Z',
                optionId: '195aa790-a520-444b-95c2-f6c5f4cf63b1',
                option: {
                  id: '195aa790-a520-444b-95c2-f6c5f4cf63b1',
                  name: 'matte',
                  displayName: 'Matte',
                  price: 35,
                  optionGroupId: 'a95635bd-fd69-44b7-8f63-cab9fbaacbf1',
                  createdAt: '2024-03-15T10:00:00.000Z',
                  updatedAt: '2024-03-15T10:00:00.000Z',
                },
              },
            ],
          },
        ],
      });
      expect(cartService.addItem).toHaveBeenCalledWith(mockUser, addItemDto);
    });

    it('should validate required fields', async () => {
      const invalidDto = {};

      const response = await request(app.getHttpServer())
        .post('/cart/items')
        .send(invalidDto);

      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('should handle invalid product ID', async () => {
      const invalidDto = {
        productId: 'invalid-uuid',
        quantity: 1,
        optionIds: [],
      };

      const response = await request(app.getHttpServer())
        .post('/cart/items')
        .send(invalidDto);

      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    });
  });

  describe('PATCH /cart/items/:itemId', () => {
    it('should update item quantity', async () => {
      jest
        .spyOn(CartService.prototype, 'updateItemQuantity')
        .mockResolvedValue(mockCart);

      const itemId = createUUID();
      const updateDto = { quantity: 2 };

      const response = await request(app.getHttpServer())
        .patch(`/cart/items/${itemId}`)
        .send(updateDto);

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: '1fd7b09c-6da1-4f84-afe5-9ab0117c4cab',
        totalPrice: 835,
        createdAt: '2024-03-15T10:00:00.000Z',
        updatedAt: '2024-03-15T10:00:00.000Z',
        items: [
          {
            id: 'a87f1507-55f5-41e1-b66e-34b245dd3e00',
            productId: '09e51e85-e64e-4b40-a5d5-d791dfdcdd2a',
            quantity: 1,
            price: 835,
            totalPrice: 835,
            createdAt: '2024-03-15T10:00:00.000Z',
            updatedAt: '2024-03-15T10:00:00.000Z',
            product: {
              id: '09e51e85-e64e-4b40-a5d5-d791dfdcdd2a',
              name: 'Trailblazer Pro',
              description:
                'High-performance mountain bike for serious trail riders',
              price: 800,
              categoryId: '3fee385c-8b66-4571-9d24-4c18e9223515',
              createdAt: '2024-03-15T10:00:00.000Z',
              updatedAt: '2024-03-15T10:00:00.000Z',
            },
            itemOptions: [
              {
                id: '1db5f36b-d590-4334-83db-0004701f8965',
                createdAt: '2024-03-15T10:00:00.000Z',
                updatedAt: '2024-03-15T10:00:00.000Z',
                optionId: '195aa790-a520-444b-95c2-f6c5f4cf63b1',
                option: {
                  id: '195aa790-a520-444b-95c2-f6c5f4cf63b1',
                  name: 'matte',
                  displayName: 'Matte',
                  price: 35,
                  optionGroupId: 'a95635bd-fd69-44b7-8f63-cab9fbaacbf1',
                  createdAt: '2024-03-15T10:00:00.000Z',
                  updatedAt: '2024-03-15T10:00:00.000Z',
                },
              },
            ],
          },
        ],
      });
      expect(cartService.updateItemQuantity).toHaveBeenCalledWith(
        mockUser,
        itemId,
        updateDto,
      );
    });

    it('should validate quantity is positive', async () => {
      const itemId = createUUID();
      const invalidDto = { quantity: -1 };

      const response = await request(app.getHttpServer())
        .patch(`/cart/items/${itemId}`)
        .send(invalidDto);

      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('should handle invalid item ID format', async () => {
      const invalidItemId = 'invalid-uuid';
      const validDto = { quantity: 1 };

      const response = await request(app.getHttpServer())
        .patch(`/cart/items/${invalidItemId}`)
        .send(validDto);

      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    });

    it('should handle service error when updating quantity', async () => {
      const itemId = createUUID();
      const validDto = { quantity: 1 };

      jest
        .spyOn(CartService.prototype, 'updateItemQuantity')
        .mockRejectedValue(new Error('Failed to update quantity'));

      const response = await request(app.getHttpServer())
        .patch(`/cart/items/${itemId}`)
        .send(validDto);

      expect(response.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('DELETE /cart/items/:itemId', () => {
    it('should remove item from cart', async () => {
      jest
        .spyOn(CartService.prototype, 'removeItem')
        .mockResolvedValue(mockCart);

      const itemId = createUUID();

      const response = await request(app.getHttpServer()).delete(
        `/cart/items/${itemId}`,
      );

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: '1fd7b09c-6da1-4f84-afe5-9ab0117c4cab',
        totalPrice: 835,
        createdAt: '2024-03-15T10:00:00.000Z',
        updatedAt: '2024-03-15T10:00:00.000Z',
        items: [
          {
            id: 'a87f1507-55f5-41e1-b66e-34b245dd3e00',
            productId: '09e51e85-e64e-4b40-a5d5-d791dfdcdd2a',
            quantity: 1,
            price: 835,
            totalPrice: 835,
            createdAt: '2024-03-15T10:00:00.000Z',
            updatedAt: '2024-03-15T10:00:00.000Z',
            product: {
              id: '09e51e85-e64e-4b40-a5d5-d791dfdcdd2a',
              name: 'Trailblazer Pro',
              description:
                'High-performance mountain bike for serious trail riders',
              price: 800,
              categoryId: '3fee385c-8b66-4571-9d24-4c18e9223515',
              createdAt: '2024-03-15T10:00:00.000Z',
              updatedAt: '2024-03-15T10:00:00.000Z',
            },
            itemOptions: [
              {
                id: '1db5f36b-d590-4334-83db-0004701f8965',
                createdAt: '2024-03-15T10:00:00.000Z',
                updatedAt: '2024-03-15T10:00:00.000Z',
                optionId: '195aa790-a520-444b-95c2-f6c5f4cf63b1',
                option: {
                  id: '195aa790-a520-444b-95c2-f6c5f4cf63b1',
                  name: 'matte',
                  displayName: 'Matte',
                  price: 35,
                  optionGroupId: 'a95635bd-fd69-44b7-8f63-cab9fbaacbf1',
                  createdAt: '2024-03-15T10:00:00.000Z',
                  updatedAt: '2024-03-15T10:00:00.000Z',
                },
              },
            ],
          },
        ],
      });
      expect(cartService.removeItem).toHaveBeenCalledWith(mockUser, itemId);
    });

    it('should handle invalid item ID format', async () => {
      const invalidItemId = 'invalid-uuid';

      const response = await request(app.getHttpServer()).delete(
        `/cart/items/${invalidItemId}`,
      );

      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    });
  });
});
