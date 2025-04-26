import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ProductOption } from '@Shop/entities/product-option.entity';
import { ProductOptionGroup } from '@Shop/entities/product-option-group.entity';
import { InventoryItem } from '@Shop/entities/inventory-item.entity';
import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { OptionRule } from '@Shop/entities/option-rule.entity';
import { ProductOptionsService } from '../services/product-options.service';
import { createTestApp } from '../../../test/create-test.app';

describe('ProductOptionController', () => {
  let app: INestApplication<App>;
  let productOptionsService: ProductOptionsService;

  beforeEach(async () => {
    app = await createTestApp();

    productOptionsService = app.get<ProductOptionsService>(
      ProductOptionsService,
    );
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /product-options/:optionId', () => {
    it('should return ProductOption', async () => {
      jest.spyOn(ProductOptionsService.prototype, 'getById').mockResolvedValue({
        id: '7ba7b5bd-2390-43d6-9893-e959068a1116',
        name: 'Option-095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
        displayName: 'Large',
        basePrice: 6,
        isActive: true,
        optionGroupId: '095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
        optionGroup: {
          id: '814c6b60-2965-4464-abed-1587b4668e1e',
          name: 'Size',
          displayName: 'Size',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as ProductOptionGroup,
        inventoryItemId: '5c39c75d-93a9-4c73-a7bf-ef107340fa8e',
        inventoryItem: {
          id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
          quantity: 100,
          outOfStock: false,
          productOptionId: '13585532-a295-4a82-b7bf-0abc07064ee9',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as InventoryItem,
        rulesAsCondition: [] as OptionRule[],
        rulesAsResult: [] as OptionRule[],
        priceRules: [] as OptionPriceRule[],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      } as ProductOption);

      const optionId = 'bb88c5fd-e2fb-4d9a-9dd0-4a0f69228c62';
      const response = await request(app.getHttpServer()).get(
        `/product-options/${optionId}`,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: '7ba7b5bd-2390-43d6-9893-e959068a1116',
        name: 'Option-095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
        displayName: 'Large',
        basePrice: 6,
        inventoryItem: {
          id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
          quantity: 100,
          outOfStock: false,
          productOptionId: '13585532-a295-4a82-b7bf-0abc07064ee9',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
      expect(productOptionsService.getById).toHaveBeenCalledWith(optionId);
    });

    it('should return 400 for invalid UUID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/product-options/invalid-uuid',
      );

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /product-options', () => {
    it('should return all ProductOptions', async () => {
      jest.spyOn(ProductOptionsService.prototype, 'getAll').mockResolvedValue([
        {
          id: '7ba7b5bd-2390-43d6-9893-e959068a1116',
          name: 'Option-095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
          displayName: 'Large',
          basePrice: 6,
          isActive: true,
          optionGroupId: '095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
          optionGroup: {
            id: '814c6b60-2965-4464-abed-1587b4668e1e',
            name: 'Size',
            displayName: 'Size',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-02'),
          } as ProductOptionGroup,
          inventoryItem: {
            id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
            quantity: 100,
            outOfStock: false,
            productOptionId: '13585532-a295-4a82-b7bf-0abc07064ee9',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-02'),
          } as InventoryItem,
          rulesAsCondition: [] as OptionRule[],
          rulesAsResult: [] as OptionRule[],
          priceRules: [] as OptionPriceRule[],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
      ] as ProductOption[]);

      const response = await request(app.getHttpServer()).get(
        `/product-options`,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject([
        {
          id: '7ba7b5bd-2390-43d6-9893-e959068a1116',
          name: 'Option-095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
          displayName: 'Large',
          basePrice: 6,
          inventoryItem: {
            id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
            quantity: 100,
            outOfStock: false,
            productOptionId: '13585532-a295-4a82-b7bf-0abc07064ee9',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z',
          },
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
      ]);
      expect(productOptionsService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST /product-options', () => {
    it('should create ProductOption for product', async () => {
      jest.spyOn(ProductOptionsService.prototype, 'create').mockResolvedValue({
        id: '7ba7b5bd-2390-43d6-9893-e959068a1116',
        name: 'Option-095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
        displayName: 'Large',
        basePrice: 6,
        isActive: true,
        optionGroupId: '095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
        optionGroup: {
          id: '814c6b60-2965-4464-abed-1587b4668e1e',
          name: 'Size',
          displayName: 'Size',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as ProductOptionGroup,
        inventoryItemId: '5c39c75d-93a9-4c73-a7bf-ef107340fa8e',
        inventoryItem: {
          id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
          quantity: 100,
          outOfStock: false,
          productOptionId: '13585532-a295-4a82-b7bf-0abc07064ee9',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as InventoryItem,
        rulesAsCondition: [] as OptionRule[],
        rulesAsResult: [] as OptionRule[],
        priceRules: [] as OptionPriceRule[],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      } as ProductOption);

      const createProductOptionDto = {
        name: 'Test Product',
        displayName: 'Test description',
        basePrice: 72.99,
        isActive: true,
        optionGroupId: '5a4979e1-0791-4bf0-88cd-2c47f0ae540a',
      };

      const response = await request(app.getHttpServer())
        .post(`/product-options`)
        .send(createProductOptionDto);

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        id: '7ba7b5bd-2390-43d6-9893-e959068a1116',
        name: 'Option-095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
        displayName: 'Large',
        basePrice: 6,
        inventoryItem: {
          id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
          quantity: 100,
          outOfStock: false,
          productOptionId: '13585532-a295-4a82-b7bf-0abc07064ee9',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
      expect(productOptionsService.create).toHaveBeenCalledWith({
        name: 'Test Product',
        displayName: 'Test description',
        basePrice: 72.99,
        isActive: true,
        optionGroupId: '5a4979e1-0791-4bf0-88cd-2c47f0ae540a',
      });
    });
  });

  describe('PUT /product-options/:optionId', () => {
    it('should update an ProductOption', async () => {
      jest.spyOn(ProductOptionsService.prototype, 'update').mockResolvedValue({
        id: '7ba7b5bd-2390-43d6-9893-e959068a1116',
        name: 'Option-095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
        displayName: 'Large',
        basePrice: 6,
        isActive: true,
        optionGroupId: '095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
        optionGroup: {
          id: '814c6b60-2965-4464-abed-1587b4668e1e',
          name: 'Size',
          displayName: 'Size',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as ProductOptionGroup,
        inventoryItem: {
          id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
          quantity: 100,
          outOfStock: false,
          productOptionId: '13585532-a295-4a82-b7bf-0abc07064ee9',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as InventoryItem,
        rulesAsCondition: [] as OptionRule[],
        rulesAsResult: [] as OptionRule[],
        priceRules: [] as OptionPriceRule[],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      });

      const updateDto = {
        name: 'Large',
        price: 10.99,
      };

      const optionId = 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61';
      const response = await request(app.getHttpServer())
        .patch(`/product-options/${optionId}`)
        .send(updateDto);

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: '7ba7b5bd-2390-43d6-9893-e959068a1116',
        name: 'Option-095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
        displayName: 'Large',
        basePrice: 6,
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
      expect(productOptionsService.update).toHaveBeenCalledWith(optionId, {
        name: 'Large',
      });
    });
  });

  describe('DELETE /product-options/:optionId', () => {
    it('should remove an ProductOption', async () => {
      jest.spyOn(ProductOptionsService.prototype, 'remove').mockResolvedValue();

      const optionId = 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61';
      const response = await request(app.getHttpServer()).delete(
        `/product-options/${optionId}`,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(productOptionsService.remove).toHaveBeenCalledWith(optionId);
    });
  });
});
