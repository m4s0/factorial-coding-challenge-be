import { EntityManager } from 'typeorm';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { createUUID } from '@Common/utils/create-uuid';
import { ProductCategory } from '@Shop/entities/product-category.entity';
import { createTestApp } from '../../../test/create-test.app';
import { createProductCategory } from '../../../test/helpers/create-product-category';
import { ProductCategoriesService } from './product-categories.service';

describe('ProductCategoriesService', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let productCategoriesService: ProductCategoriesService;

  beforeAll(async () => {
    app = await createTestApp();

    entityManager = app.get<EntityManager>(EntityManager);
    productCategoriesService = app.get<ProductCategoriesService>(
      ProductCategoriesService,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('getById', () => {
    it('should get a ProductCategory by ID', async () => {
      const category = await createProductCategory(entityManager, {});

      const result = await productCategoriesService.getById(category.id);

      expect(result).toMatchObject({
        id: category.id,
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      });
    });

    it('should throw NotFoundException when ProductCategory does not exist', async () => {
      const id = createUUID();

      await expect(productCategoriesService.getById(id)).rejects.toThrow(
        new NotFoundException(`Category with ID ${id} not found`),
      );
    });
  });

  describe('getAll', () => {
    it('should get all ProductCategories', async () => {
      const category = await createProductCategory(entityManager, {});

      const result = await productCategoriesService.getAll();

      expect(result[0]).toMatchObject({
        id: category.id,
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      });
    });
  });

  describe('create', () => {
    it('should create a ProductCategory', async () => {
      const input = {
        name: 'New Category',
        description: 'Description',
        isActive: true,
      };

      const result = await productCategoriesService.create(input);

      expect(result).toMatchObject({
        id: expect.any(String),
        name: 'New Category',
        description: 'Description',
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('update', () => {
    it('should update a ProductCategory', async () => {
      const category = await createProductCategory(entityManager, {});

      const result = await productCategoriesService.update(category.id, {
        name: 'Updated Name',
      });

      expect(result).toMatchObject({
        id: category.id,
        name: 'Updated Name',
        description: category.description,
        isActive: category.isActive,
        createdAt: category.createdAt,
      });

      expect(result.updatedAt.getTime()).toBeGreaterThan(
        category.updatedAt.getTime(),
      );
    });

    it('should throw NotFoundException when updating non-existent ProductCategory', async () => {
      const id = createUUID();

      await expect(
        productCategoriesService.update(id, { name: 'Updated Name' }),
      ).rejects.toThrow(
        new NotFoundException(`Category with ID ${id} not found`),
      );
    });
  });

  describe('remove', () => {
    it('should remove a ProductCategory', async () => {
      const category = await createProductCategory(entityManager, {});

      await productCategoriesService.remove(category.id);

      const result = await entityManager.findOne(ProductCategory, {
        where: { id: category.id },
      });

      expect(result).toBeNull();
    });

    it('should throw NotFoundException when removing non-existent ProductCategory', async () => {
      const id = createUUID();

      await expect(productCategoriesService.remove(id)).rejects.toThrow(
        new NotFoundException(`Category with ID ${id} not found`),
      );
    });
  });
});
