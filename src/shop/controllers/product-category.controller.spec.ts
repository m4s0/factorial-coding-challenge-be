import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ProductCategoriesService } from '@Shop/services/product-categories.service';
import { createUUID } from '@Common/utils/create-uuid';
import { ProductCategory } from '@Shop/entities/product-category.entity';
import { createTestApp } from '../../../test/create-test.app';

describe('ProductCategoryController', () => {
  let app: INestApplication<App>;
  let productCategoriesService: ProductCategoriesService;

  beforeEach(async () => {
    app = await createTestApp();

    productCategoriesService = app.get<ProductCategoriesService>(
      ProductCategoriesService,
    );
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /product-categories/:categoryId', () => {
    it('should return ProductCategory', async () => {
      const categoryId = 'e08354f3-9ede-4b45-9f23-04584bfa69fc';

      const productCategory = {
        id: categoryId,
        name: 'Mountain Bikes',
        description: 'Bikes designed for off-road cycling',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      } as ProductCategory;

      jest
        .spyOn(ProductCategoriesService.prototype, 'getById')
        .mockResolvedValue(productCategory);

      const response = await request(app.getHttpServer()).get(
        `/product-categories/${categoryId}`,
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: 'e08354f3-9ede-4b45-9f23-04584bfa69fc',
        name: 'Mountain Bikes',
        description: 'Bikes designed for off-road cycling',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
      expect(productCategoriesService.getById).toHaveBeenCalledWith(categoryId);
    });

    it('should return 400 for invalid UUID', async () => {
      const response = await request(app.getHttpServer()).get(
        '/product-categories/invalid-uuid',
      );

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /product-categories', () => {
    it('should return all ProductCategories', async () => {
      const productCategories = [
        {
          id: 'e08354f3-9ede-4b45-9f23-04584bfa69fc',
          name: 'Mountain Bikes',
          description: 'Bikes designed for off-road cycling',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        },
        {
          id: 'c4a2c6f3-9ede-4b45-9f23-04584bfa69fc',
          name: 'Road Bikes',
          description: 'Bikes designed for road cycling',
          isActive: true,
          createdAt: new Date('2024-01-03'),
          updatedAt: new Date('2024-01-04'),
        },
      ] as ProductCategory[];

      jest
        .spyOn(ProductCategoriesService.prototype, 'getAll')
        .mockResolvedValue(productCategories);

      const response = await request(app.getHttpServer()).get(
        '/product-categories',
      );

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject([
        {
          id: 'e08354f3-9ede-4b45-9f23-04584bfa69fc',
          name: 'Mountain Bikes',
          description: 'Bikes designed for off-road cycling',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
        {
          id: 'c4a2c6f3-9ede-4b45-9f23-04584bfa69fc',
          name: 'Road Bikes',
          description: 'Bikes designed for road cycling',
          isActive: true,
          createdAt: '2024-01-03T00:00:00.000Z',
          updatedAt: '2024-01-04T00:00:00.000Z',
        },
      ]);
      expect(productCategoriesService.getAll).toHaveBeenCalled();
    });
  });

  describe('POST /product-categories', () => {
    it('should create ProductCategory for product', async () => {
      const newCategory = {
        id: createUUID(),
        name: 'Mountain Bikes',
        description: 'Bikes designed for off-road cycling',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      } as ProductCategory;

      jest
        .spyOn(ProductCategoriesService.prototype, 'create')
        .mockResolvedValue(newCategory);

      const createProductCategoryDto = {
        name: 'Mountain Bikes',
        description: 'Bikes designed for off-road cycling',
        isActive: true,
      };

      const response = await request(app.getHttpServer())
        .post('/product-categories')
        .send(createProductCategoryDto);

      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        id: newCategory.id,
        name: 'Mountain Bikes',
        description: 'Bikes designed for off-road cycling',
        isActive: true,
        createdAt: newCategory.createdAt.toISOString(),
        updatedAt: newCategory.updatedAt.toISOString(),
      });
      expect(productCategoriesService.create).toHaveBeenCalledWith({
        name: 'Mountain Bikes',
        description: 'Bikes designed for off-road cycling',
        isActive: true,
      });
    });
  });

  describe('PUT /product-categories/:categoryId', () => {
    it('should update a ProductCategory', async () => {
      const categoryId = 'e08354f3-9ede-4b45-9f23-04584bfa69fc';

      const updatedCategory = {
        id: categoryId,
        name: 'Mountain Bikes',
        description: 'Bikes designed for off-road cycling',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      } as ProductCategory;

      jest
        .spyOn(ProductCategoriesService.prototype, 'update')
        .mockResolvedValue(updatedCategory);

      const updateProductCategoryDto = {
        name: 'Mountain Bikes',
        description: 'Bikes designed for off-road cycling',
        isActive: true,
      };

      const response = await request(app.getHttpServer())
        .patch(`/product-categories/${categoryId}`)
        .send(updateProductCategoryDto);

      expect(response.statusCode).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: categoryId,
        name: 'Mountain Bikes',
        description: 'Bikes designed for off-road cycling',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
      expect(productCategoriesService.update).toHaveBeenCalledWith(
        categoryId,
        updateProductCategoryDto,
      );
    });
  });

  describe('DELETE /product-categories/:categoryId', () => {
    it('should remove a ProductCategory', async () => {
      const categoryId = createUUID();

      jest
        .spyOn(ProductCategoriesService.prototype, 'remove')
        .mockResolvedValue();

      const response = await request(app.getHttpServer()).delete(
        `/product-categories/${categoryId}`,
      );

      expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(productCategoriesService.remove).toHaveBeenCalledWith(categoryId);
    });

    it('should return 400 for invalid UUID', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/product-categories/invalid-uuid',
      );

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
