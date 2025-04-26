import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ProductOptionGroup } from '@Shop/entities/product-option-group.entity';
import { ProductOptionGroupsService } from '@Shop/services/product-option-groups.service';
import { Product } from '@Shop/entities/product.entity';
import { ProductOption } from '@Shop/entities/product-option.entity';
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
          id: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
          name: 'Size',
          displayName: 'Select Size',
          product: {
            id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
            name: 'Test Product',
            description: 'Test Description',
            basePrice: 99.99,
            isActive: true,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          } as Product,
          options: [] as ProductOption[],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        } as ProductOptionGroup);

      const groupId = 'bb88c5fd-e2fb-4d9a-9dd0-4a0f69228c62';
      const response = await request(app.getHttpServer()).get(
        `/product-option-groups/${groupId}`,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
        name: 'Size',
        displayName: 'Select Size',
        options: [],
        product: {
          id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
          name: 'Test Product',
          description: 'Test Description',
          basePrice: 99.99,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
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
            id: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
            name: 'Size',
            displayName: 'Select Size',
            product: {
              id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
              name: 'Test Product',
              description: 'Test Description',
              basePrice: 99.99,
              isActive: true,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            } as Product,
            options: [] as ProductOption[],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          } as ProductOptionGroup,
        ] as ProductOptionGroup[]);

      const response = await request(app.getHttpServer()).get(
        `/product-option-groups`,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject([
        {
          id: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
          name: 'Size',
          displayName: 'Select Size',
          options: [],
          product: {
            id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
            name: 'Test Product',
            description: 'Test Description',
            basePrice: 99.99,
            isActive: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
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
            id: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
            name: 'Size',
            displayName: 'Select Size',
            product: {
              id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
              name: 'Test Product',
              description: 'Test Description',
              basePrice: 99.99,
              isActive: true,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            } as Product,
            options: [] as ProductOption[],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          } as ProductOptionGroup,
        ] as ProductOptionGroup[]);

      const productId = 'bb88c5fd-e2fb-4d9a-9dd0-4a0f69228c62';
      const response = await request(app.getHttpServer()).get(
        `/product-option-groups/product/${productId}`,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject([
        {
          id: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
          name: 'Size',
          displayName: 'Select Size',
          options: [],
          product: {
            id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
            name: 'Test Product',
            description: 'Test Description',
            basePrice: 99.99,
            isActive: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
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
          id: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
          name: 'Size',
          displayName: 'Select Size',
          product: {
            id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
            name: 'Test Product',
            description: 'Test Description',
            basePrice: 99.99,
            isActive: true,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          } as Product,
          options: [] as ProductOption[],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
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
      expect(response.body).toMatchObject({
        id: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
        name: 'Size',
        displayName: 'Select Size',
        options: [],
        product: {
          id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
          name: 'Test Product',
          description: 'Test Description',
          basePrice: 99.99,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
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
          id: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
          name: 'Size',
          displayName: 'Select Size',
          product: {
            id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
            name: 'Test Product',
            description: 'Test Description',
            basePrice: 99.99,
            isActive: true,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          } as Product,
          options: [] as ProductOption[],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
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
      expect(response.body).toMatchObject({
        id: 'a2444f70-749c-41e8-bdc3-2de2348afeb0',
        name: 'Size',
        displayName: 'Select Size',
        options: [],
        product: {
          id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
          name: 'Test Product',
          description: 'Test Description',
          basePrice: 99.99,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
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
