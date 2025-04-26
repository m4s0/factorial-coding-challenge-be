import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { InventoryItem } from '@Shop/entities/inventory-item.entity';
import { RuleType } from '@Shop/entities/rule-type';
import { OptionRule } from '@Shop/entities/option-rule.entity';
import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { ProductOption } from '@Shop/entities/product-option.entity';
import { InventoryService } from '../services/inventory.service';
import { createTestApp } from '../../../test/create-test.app';

describe('InventoryController', () => {
  let app: INestApplication<App>;
  let inventoryService: InventoryService;
  const mockInventoryItem = {
    id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
    quantity: 100,
    outOfStock: false,
    productOptionId: '13585532-a295-4a82-b7bf-0abc07064ee9',
    productOption: {
      id: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
      name: 'Size',
      displayName: 'Product Size',
      basePrice: 10.99,
      isActive: true,
      optionGroupId: '31b7d272-3664-4a7f-87f7-09d95c60dfac',
      rulesAsCondition: [
        {
          id: '13585532-a295-4a82-b7bf-0abc07064ee9',
          ruleType: RuleType.REQUIRES,
          isActive: true,
          ifOptionId: 'a8f340f5-f724-43f8-b0c8-c43c29220923',
          thenOptionId: '31b7d272-3664-4a7f-87f7-09d95c60dfac',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as OptionRule,
      ],
      rulesAsResult: [
        {
          id: 'd8cb0d41-f2bf-40ec-8f0d-24316c9eb94b',
          ruleType: RuleType.REQUIRES,
          isActive: true,
          ifOptionId: 'ec428b31-7b25-472f-813f-ff05022f580e',
          thenOptionId: '4f0bbaec-fe89-43d6-ac39-9fa215bd3bbd',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as OptionRule,
      ],
      priceRules: [
        {
          id: '2b6c2ef0-776e-4e55-b3ad-7059539150ce',
          price: 5.0,
          targetOptionId: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
          dependentOptionId: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as OptionPriceRule,
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    } as ProductOption,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  } as InventoryItem;

  beforeEach(async () => {
    app = await createTestApp();

    inventoryService = app.get<InventoryService>(InventoryService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /inventory', () => {
    it('should return all InventoryItems', async () => {
      jest
        .spyOn(InventoryService.prototype, 'getAll')
        .mockResolvedValue([mockInventoryItem]);

      const response = await request(app.getHttpServer()).get('/inventory');

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject([
        {
          id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
          quantity: 100,
          outOfStock: false,
          productOptionId: '13585532-a295-4a82-b7bf-0abc07064ee9',
          productOption: {
            id: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
            name: 'Size',
            displayName: 'Product Size',
            basePrice: 10.99,
            isActive: true,
            rulesAsCondition: [
              {
                id: '13585532-a295-4a82-b7bf-0abc07064ee9',
                ruleType: 'requires',
                ifOptionId: 'a8f340f5-f724-43f8-b0c8-c43c29220923',
                thenOptionId: '31b7d272-3664-4a7f-87f7-09d95c60dfac',
                isActive: true,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-02T00:00:00.000Z',
              },
            ],
            rulesAsResult: [
              {
                id: 'd8cb0d41-f2bf-40ec-8f0d-24316c9eb94b',
                ruleType: 'requires',
                ifOptionId: 'ec428b31-7b25-472f-813f-ff05022f580e',
                thenOptionId: '4f0bbaec-fe89-43d6-ac39-9fa215bd3bbd',
                isActive: true,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-02T00:00:00.000Z',
              },
            ],
            priceRules: [
              {
                id: '2b6c2ef0-776e-4e55-b3ad-7059539150ce',
                price: 5,
                targetOptionId: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
                dependentOptionId: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
                isActive: true,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-02T00:00:00.000Z',
              },
            ],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z',
          },
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
      ]);
    });

    it('should filter InventoryItems by type', async () => {
      jest
        .spyOn(InventoryService.prototype, 'getAll')
        .mockResolvedValue([mockInventoryItem]);

      const response = await request(app.getHttpServer()).get('/inventory');

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject([
        {
          id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
          quantity: 100,
          outOfStock: false,
          productOptionId: '13585532-a295-4a82-b7bf-0abc07064ee9',
          productOption: {
            id: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
            name: 'Size',
            displayName: 'Product Size',
            basePrice: 10.99,
            isActive: true,
            rulesAsCondition: [
              {
                id: '13585532-a295-4a82-b7bf-0abc07064ee9',
                ruleType: 'requires',
                ifOptionId: 'a8f340f5-f724-43f8-b0c8-c43c29220923',
                thenOptionId: '31b7d272-3664-4a7f-87f7-09d95c60dfac',
                isActive: true,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-02T00:00:00.000Z',
              },
            ],
            rulesAsResult: [
              {
                id: 'd8cb0d41-f2bf-40ec-8f0d-24316c9eb94b',
                ruleType: 'requires',
                ifOptionId: 'ec428b31-7b25-472f-813f-ff05022f580e',
                thenOptionId: '4f0bbaec-fe89-43d6-ac39-9fa215bd3bbd',
                isActive: true,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-02T00:00:00.000Z',
              },
            ],
            priceRules: [
              {
                id: '2b6c2ef0-776e-4e55-b3ad-7059539150ce',
                price: 5,
                targetOptionId: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
                dependentOptionId: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
                isActive: true,
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-02T00:00:00.000Z',
              },
            ],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z',
          },
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
      ]);
      expect(inventoryService.getAll).toHaveBeenCalledWith();
    });
  });

  describe('GET /inventory/:inventoryItemId', () => {
    it('should return a single InventoryItem', async () => {
      jest
        .spyOn(InventoryService.prototype, 'getById')
        .mockResolvedValue(mockInventoryItem);

      const response = await request(app.getHttpServer()).get(
        `/inventory/${mockInventoryItem.id}`,
      );

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
        quantity: 100,
        outOfStock: false,
        productOptionId: '13585532-a295-4a82-b7bf-0abc07064ee9',
        productOption: {
          id: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
          name: 'Size',
          displayName: 'Product Size',
          basePrice: 10.99,
          isActive: true,
          rulesAsCondition: [
            {
              id: '13585532-a295-4a82-b7bf-0abc07064ee9',
              ruleType: 'requires',
              ifOptionId: 'a8f340f5-f724-43f8-b0c8-c43c29220923',
              thenOptionId: '31b7d272-3664-4a7f-87f7-09d95c60dfac',
              isActive: true,
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-02T00:00:00.000Z',
            },
          ],
          rulesAsResult: [
            {
              id: 'd8cb0d41-f2bf-40ec-8f0d-24316c9eb94b',
              ruleType: 'requires',
              ifOptionId: 'ec428b31-7b25-472f-813f-ff05022f580e',
              thenOptionId: '4f0bbaec-fe89-43d6-ac39-9fa215bd3bbd',
              isActive: true,
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-02T00:00:00.000Z',
            },
          ],
          priceRules: [
            {
              id: '2b6c2ef0-776e-4e55-b3ad-7059539150ce',
              price: 5,
              targetOptionId: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
              dependentOptionId: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
              isActive: true,
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-02T00:00:00.000Z',
            },
          ],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
    });
  });

  describe('GET /inventory/product/:productId', () => {
    it('should return inventory status for product', async () => {
      jest
        .spyOn(InventoryService.prototype, 'getInventoryByProduct')
        .mockResolvedValue({
          id: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
          quantity: 15,
          outOfStock: true,
          productOptionId: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as InventoryItem);

      const productId = 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61';
      const response = await request(app.getHttpServer()).get(
        `/inventory/product/${productId}`,
      );

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
        quantity: 15,
        outOfStock: true,
        productOptionId: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
      expect(inventoryService.getInventoryByProduct).toHaveBeenCalledWith(
        productId,
      );
    });
  });

  describe('POST /inventory', () => {
    it('should create a new InventoryItem', async () => {
      jest
        .spyOn(InventoryService.prototype, 'create')
        .mockResolvedValue(mockInventoryItem);

      const createInventoryItemDto = {
        productOptionId: '09cd5721-2521-44d2-a076-c7fce8b3f230',
        quantity: 10,
        outOfStock: false,
      };

      const response = await request(app.getHttpServer())
        .post('/inventory')
        .send(createInventoryItemDto);

      expect(response.statusCode).toEqual(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
        quantity: 100,
        outOfStock: false,
        productOptionId: '13585532-a295-4a82-b7bf-0abc07064ee9',
        productOption: {
          id: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
          name: 'Size',
          displayName: 'Product Size',
          basePrice: 10.99,
          isActive: true,
          rulesAsCondition: [
            {
              id: '13585532-a295-4a82-b7bf-0abc07064ee9',
              ruleType: 'requires',
              ifOptionId: 'a8f340f5-f724-43f8-b0c8-c43c29220923',
              thenOptionId: '31b7d272-3664-4a7f-87f7-09d95c60dfac',
              isActive: true,
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-02T00:00:00.000Z',
            },
          ],
          rulesAsResult: [
            {
              id: 'd8cb0d41-f2bf-40ec-8f0d-24316c9eb94b',
              ruleType: 'requires',
              ifOptionId: 'ec428b31-7b25-472f-813f-ff05022f580e',
              thenOptionId: '4f0bbaec-fe89-43d6-ac39-9fa215bd3bbd',
              isActive: true,
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-02T00:00:00.000Z',
            },
          ],
          priceRules: [
            {
              id: '2b6c2ef0-776e-4e55-b3ad-7059539150ce',
              price: 5,
              targetOptionId: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
              dependentOptionId: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
              isActive: true,
              createdAt: '2024-01-01T00:00:00.000Z',
              updatedAt: '2024-01-02T00:00:00.000Z',
            },
          ],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
    });

    it('should get an error if payload is not valid', async () => {
      const invalidPayload = {};

      const response = await request(app.getHttpServer())
        .post('/inventory')
        .send(invalidPayload);

      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toMatchObject({
        message: 'Validation failed',
        errors: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['productOptionId'],
            message: 'Required',
          },
          {
            code: 'invalid_type',
            expected: 'number',
            received: 'undefined',
            path: ['quantity'],
            message: 'Quantity is required',
          },
          {
            code: 'invalid_type',
            expected: 'boolean',
            received: 'undefined',
            path: ['outOfStock'],
            message: 'Required',
          },
        ],
      });
    });
  });

  describe('PUT /inventory/:inventoryItemId', () => {
    it('should update inventory for option', async () => {
      const inventoryItemId = 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61';

      jest.spyOn(InventoryService.prototype, 'update').mockResolvedValue({
        id: inventoryItemId,
        quantity: 15,
        outOfStock: true,
        productOptionId: 'a7612185-d630-425f-8615-88fa74f61490',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      } as InventoryItem);

      const updateDto = {
        quantity: 15,
        outOfStock: true,
      };

      const response = await request(app.getHttpServer())
        .patch(`/inventory/${inventoryItemId}`)
        .send(updateDto);

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: inventoryItemId,
        quantity: 15,
        outOfStock: true,
        productOptionId: 'a7612185-d630-425f-8615-88fa74f61490',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
      expect(inventoryService.update).toHaveBeenCalledWith(
        inventoryItemId,
        updateDto,
      );
    });

    it('should return 400 if invalid UUID is provided', async () => {
      const response = await request(app.getHttpServer())
        .patch('/inventory/invalid-uuid')
        .send({ quantity: 15, isAvailable: true });

      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /inventory/:inventoryItemId', () => {
    it('should delete a InventoryItem', async () => {
      jest
        .spyOn(InventoryService.prototype, 'remove')
        .mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete(`/inventory/${mockInventoryItem.id}`)
        .expect(HttpStatus.OK);

      expect(inventoryService.remove).toHaveBeenCalledWith(
        mockInventoryItem.id,
      );
    });
  });
});
