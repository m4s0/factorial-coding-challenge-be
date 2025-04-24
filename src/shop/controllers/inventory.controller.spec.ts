import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ProductOption } from '@Shop/entities/product-option.entity';
import { createTestApp } from '../../../test/create-test.app';
import { InventoryService } from '../services/inventory.service';

describe('InventoryController', () => {
  let app: INestApplication<App>;
  let inventoryService: InventoryService;

  beforeEach(async () => {
    app = await createTestApp();

    inventoryService = app.get<InventoryService>(InventoryService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /inventory/product/:productId', () => {
    it('should return inventory status for product', async () => {
      jest
        .spyOn(inventoryService, 'getInventoryStatusForProduct')
        .mockResolvedValue([
          {
            productOptionId: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
            quantity: 10,
            inStock: true,
          },
        ]);

      const productId = 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61';
      const response = await request(app.getHttpServer()).get(
        `/inventory/product/${productId}`,
      );

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toEqual([
        {
          productOptionId: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
          quantity: 10,
          inStock: true,
        },
      ]);
      expect(
        inventoryService.getInventoryStatusForProduct,
      ).toHaveBeenCalledWith(productId);
    });
  });

  describe('PUT /inventory/option/:optionId', () => {
    it('should update inventory for option', async () => {
      jest.spyOn(inventoryService, 'updateInventory').mockResolvedValue({
        id: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
        quantity: 15,
        outOfStock: true,
        productOption: {} as ProductOption,
        productOptionId: 'a7612185-d630-425f-8615-88fa74f61490',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      });

      const optionId = 'bb88c5fd-e2fb-4d9a-9dd0-4a0f69228c62';
      const updateDto = {
        quantity: 15,
        outOfStock: true,
      };

      const response = await request(app.getHttpServer())
        .patch(`/inventory/option/${optionId}`)
        .send(updateDto);

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toEqual({
        id: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
        quantity: 15,
        outOfStock: true,
        productOptionId: 'a7612185-d630-425f-8615-88fa74f61490',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
      expect(inventoryService.updateInventory).toHaveBeenCalledWith(
        optionId,
        updateDto,
      );
    });

    it('should return 400 if invalid UUID is provided', async () => {
      const response = await request(app.getHttpServer())
        .patch('/inventory/option/invalid-uuid')
        .send({ quantity: 15, isAvailable: true });

      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
    });
  });
});
