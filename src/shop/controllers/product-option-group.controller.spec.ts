import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ProductOptionGroup } from '@Shop/entities/product-option-group.entity';
import { ProductOptionGroupsService } from '@Shop/services/product-option-groups.service';
import { createTestApp } from '../../../test/create-test.app';

describe('ProductOptionGroupController', () => {
  let app: INestApplication<App>;
  let productOptionGroupsService: ProductOptionGroupsService;

  beforeEach(async () => {
    app = await createTestApp();

    productOptionGroupsService = app.get<ProductOptionGroupsService>(
      ProductOptionGroupsService,
    );
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /product-option-groups/:groupId', () => {
    it('should return ProductOption', async () => {
      jest
        .spyOn(ProductOptionGroupsService.prototype, 'getById')
        .mockResolvedValue({
          id: '814c6b60-2965-4464-abed-1587b4668e1e',
          name: 'Size',
          displayName: 'Size',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as ProductOptionGroup);

      const groupId = 'bb88c5fd-e2fb-4d9a-9dd0-4a0f69228c62';
      const response = await request(app.getHttpServer()).get(
        `/product-option-groups/${groupId}`,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toEqual({
        id: '814c6b60-2965-4464-abed-1587b4668e1e',
        name: 'Size',
        displayName: 'Size',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
      expect(productOptionGroupsService.getById).toHaveBeenCalledWith(groupId);
    });

    it('should return 400 for invalid UUID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/product-option-groups/invalid-uuid',
      );

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /product-option-groups', () => {
    it('should return all ProductOptions', async () => {
      jest
        .spyOn(ProductOptionGroupsService.prototype, 'getAll')
        .mockResolvedValue([
          {
            id: '814c6b60-2965-4464-abed-1587b4668e1e',
            name: 'Size',
            displayName: 'Size',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-02'),
          },
        ] as ProductOptionGroup[]);

      const response = await request(app.getHttpServer()).get(
        `/product-option-groups`,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toEqual([
        {
          id: '814c6b60-2965-4464-abed-1587b4668e1e',
          name: 'Size',
          displayName: 'Size',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
      ]);
      expect(productOptionGroupsService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /product-option-groups/product/:productId', () => {
    it('should return ProductOptionGroups for product', async () => {
      jest
        .spyOn(
          ProductOptionGroupsService.prototype,
          'findOptionGroupsByProductId',
        )
        .mockResolvedValue([
          {
            id: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
            name: 'Size',
            productId: 'bb88c5fd-e2fb-4d9a-9dd0-4a0f69228c62',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
        ] as ProductOptionGroup[]);

      const productId = 'bb88c5fd-e2fb-4d9a-9dd0-4a0f69228c62';
      const response = await request(app.getHttpServer()).get(
        `/product-option-groups/product/${productId}`,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toEqual([
        {
          id: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
          name: 'Size',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ]);
      expect(
        productOptionGroupsService.findOptionGroupsByProductId,
      ).toHaveBeenCalledWith(productId);
    });

    it('should return 400 for invalid UUID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/product-option-groups/product/invalid-uuid',
      );

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /product-option-groups', () => {
    it('should create an ProductOptionGroup', async () => {
      jest
        .spyOn(ProductOptionGroupsService.prototype, 'create')
        .mockResolvedValue({
          id: '814c6b60-2965-4464-abed-1587b4668e1e',
          name: 'Size',
          displayName: 'Size',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as ProductOptionGroup);

      const createDto = {
        name: 'Size',
        displayName: 'Size',
        basePrice: 72.99,
        isActive: true,
        optionGroupId: ['00aa66e6-3675-4f83-bbfe-908863380bfe'],
        productId: 'bb88c5fd-e2fb-4d9a-9dd0-4a0f69228c62',
      };

      const response = await request(app.getHttpServer())
        .post('/product-option-groups')
        .send(createDto);

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual({
        id: '814c6b60-2965-4464-abed-1587b4668e1e',
        name: 'Size',
        displayName: 'Size',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
      expect(productOptionGroupsService.create).toHaveBeenCalledWith({
        name: 'Size',
        displayName: 'Size',
        productId: 'bb88c5fd-e2fb-4d9a-9dd0-4a0f69228c62',
      });
    });
  });

  describe('PUT /product-option-groups/:groupId', () => {
    it('should update an ProductOption', async () => {
      jest
        .spyOn(ProductOptionGroupsService.prototype, 'update')
        .mockResolvedValue({
          id: '814c6b60-2965-4464-abed-1587b4668e1e',
          name: 'Size',
          displayName: 'Size',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as ProductOptionGroup);

      const updateDto = {
        name: 'Large',
        price: 10.99,
      };

      const groupId = 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61';
      const response = await request(app.getHttpServer())
        .patch(`/product-option-groups/${groupId}`)
        .send(updateDto);

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toEqual({
        id: '814c6b60-2965-4464-abed-1587b4668e1e',
        name: 'Size',
        displayName: 'Size',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
      expect(productOptionGroupsService.update).toHaveBeenCalledWith(groupId, {
        name: 'Large',
      });
    });
  });

  describe('DELETE /product-option-groups/:groupId', () => {
    it('should remove an ProductOption', async () => {
      jest
        .spyOn(ProductOptionGroupsService.prototype, 'remove')
        .mockResolvedValue();

      const groupId = 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61';
      const response = await request(app.getHttpServer()).delete(
        `/product-option-groups/${groupId}`,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(productOptionGroupsService.remove).toHaveBeenCalledWith(groupId);
    });
  });
});
