import { INestApplication } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ProductOptionGroupsService } from '@Shop/services/product-option-groups.service';
import { createUUID } from '@Common/utils/create-uuid';
import { ProductOptionGroup } from '@Shop/entities/product-option-group.entity';
import { createTestApp } from '../../../test/create-test.app';
import { createProduct } from '../../../test/helpers/create-product';
import { createProductOptionGroup } from '../../../test/helpers/create-product-option-group';
import { createProductCategory } from '../../../test/helpers/create-product-category';

describe('ProductOptionGroupsService', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let productOptionGroupsService: ProductOptionGroupsService;

  beforeAll(async () => {
    app = await createTestApp();

    entityManager = app.get<EntityManager>(EntityManager);
    productOptionGroupsService = app.get<ProductOptionGroupsService>(
      ProductOptionGroupsService,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('getById', () => {
    it('should get an option group by ID', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );

      const result = await productOptionGroupsService.getById(optionGroup.id);

      expect(result).toMatchObject({
        id: optionGroup.id,
        name: optionGroup.name,
        displayName: optionGroup.displayName,
        productId: product.id,
        createdAt: optionGroup.createdAt,
        updatedAt: optionGroup.updatedAt,
      });
    });

    it('should throw NotFoundException when option group does not exist', async () => {
      const id = createUUID();

      await expect(productOptionGroupsService.getById(id)).rejects.toThrow(
        `ProductOptionGroup with ID ${id} not found`,
      );
    });
  });

  describe('getAll', () => {
    it('should get all option groups', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );

      const results = await productOptionGroupsService.getAll();

      expect(results[0]).toMatchObject({
        id: optionGroup.id,
        name: optionGroup.name,
        displayName: optionGroup.displayName,
        productId: product.id,
        createdAt: optionGroup.createdAt,
        updatedAt: optionGroup.updatedAt,
        isActive: optionGroup.isActive,
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          basePrice: product.basePrice.toString(),
          isActive: product.isActive,
          categoryId: productCategory.id,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      });
    });
  });

  describe('findOptionGroupsByProductId', () => {
    it('should find option groups by product ID', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );

      const result =
        await productOptionGroupsService.findOptionGroupsByProductId(
          product.id,
        );

      expect(result).toMatchObject([
        {
          id: optionGroup.id,
          name: optionGroup.name,
          displayName: optionGroup.displayName,
          productId: product.id,
          createdAt: optionGroup.createdAt,
          updatedAt: optionGroup.updatedAt,
          options: [],
        },
      ]);
    });
  });

  describe('create', () => {
    it('should create an option group', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });

      const createGroupInput = {
        name: 'Size',
        displayName: 'Size Selection',
        productId: product.id,
      };

      const result = await productOptionGroupsService.create(createGroupInput);

      expect(result).toMatchObject({
        id: expect.any(String),
        name: 'Size',
        displayName: 'Size Selection',
        productId: product.id,
      });
    });
  });

  describe('update', () => {
    it('should update an option group', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );

      const updateGroupInput = {
        name: 'Updated Name',
        displayName: 'Updated Display Name',
      };

      const result = await productOptionGroupsService.update(
        optionGroup.id,
        updateGroupInput,
      );

      expect(result).toMatchObject({
        id: optionGroup.id,
        name: 'Updated Name',
        displayName: 'Updated Display Name',
        productId: product.id,
      });
      expect(result.updatedAt.getTime()).toBeGreaterThan(
        optionGroup.updatedAt.getTime(),
      );
    });

    it('should throw NotFoundException when updating non-existent option', async () => {
      const id = createUUID();
      const updateGroupInput = {
        name: 'Updated Name',
        displayName: 'Updated Display Name',
      };

      await expect(
        productOptionGroupsService.update(id, updateGroupInput),
      ).rejects.toThrow(`ProductOptionGroup with ID ${id} not found`);
    });
  });

  describe('remove', () => {
    it('should remove an option group', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );

      await productOptionGroupsService.remove(optionGroup.id);

      const result = await entityManager.findOne(ProductOptionGroup, {
        where: { id: optionGroup.id },
      });

      expect(result).toBeNull();
    });

    it('should throw NotFoundException when removing non-existent option', async () => {
      const id = createUUID();

      await expect(productOptionGroupsService.remove(id)).rejects.toThrow(
        `ProductOptionGroup with ID ${id} not found`,
      );
    });
  });
});
