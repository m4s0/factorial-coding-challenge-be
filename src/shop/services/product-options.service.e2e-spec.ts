import { INestApplication } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { createUUID } from '@Common/utils/create-uuid';
import { ProductOption } from '@Shop/entities/product-option.entity';
import { ProductOptionsService } from './product-options.service';
import { createTestApp } from '../../../test/create-test.app';
import { createProduct } from '../../../test/helpers/create-product';
import { createProductOptionGroup } from '../../../test/helpers/create-product-option-group';
import { createProductOption } from '../../../test/helpers/create-product-option';
import { createProductCategory } from '../../../test/helpers/create-product-category';
import { createInventoryItem } from '../../../test/helpers/create-inventory-item';

describe('ProductOptionsService', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let productOptionsService: ProductOptionsService;

  beforeAll(async () => {
    app = await createTestApp();

    entityManager = app.get<EntityManager>(EntityManager);
    productOptionsService = app.get<ProductOptionsService>(
      ProductOptionsService,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('getById', () => {
    it('should get an option by ID', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const productOption = await createProductOption(
        entityManager,
        optionGroup,
      );

      const result = await productOptionsService.getById(productOption.id);

      expect(result).toMatchObject({
        id: productOption.id,
        name: productOption.name,
        displayName: productOption.displayName,
        basePrice: productOption.basePrice.toString(),
        isActive: productOption.isActive,
        optionGroupId: optionGroup.id,
        createdAt: productOption.createdAt,
        updatedAt: productOption.updatedAt,
      });
    });

    it('should throw NotFoundException when option does not exist', async () => {
      const id = createUUID();

      await expect(productOptionsService.getById(id)).rejects.toThrow(
        `ProductOption with ID ${id} not found`,
      );
    });
  });

  describe('getAll', () => {
    it('should return all options', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const productOption = await createProductOption(
        entityManager,
        optionGroup,
      );
      const inventoryItem = await createInventoryItem(entityManager, {
        productOptionId: productOption.id,
        quantity: 10,
        outOfStock: false,
      });

      const results = await productOptionsService.getAll();

      expect(results[0]).toMatchObject({
        id: productOption.id,
        name: productOption.name,
        displayName: productOption.displayName,
        basePrice: productOption.basePrice.toString(),
        isActive: productOption.isActive,
        optionGroupId: optionGroup.id,
        createdAt: productOption.createdAt,
        updatedAt: productOption.updatedAt,
        optionGroup: {
          id: optionGroup.id,
          name: optionGroup.name,
          displayName: optionGroup.displayName,
          isActive: optionGroup.isActive,
          productId: product.id,
          createdAt: optionGroup.createdAt,
          updatedAt: optionGroup.updatedAt,
        },
        inventoryItem: {
          id: inventoryItem.id,
          quantity: inventoryItem.quantity,
          outOfStock: inventoryItem.outOfStock,
          productOptionId: inventoryItem.productOptionId,
          createdAt: inventoryItem.createdAt,
          updatedAt: inventoryItem.updatedAt,
        },
      });
    });
  });

  describe('findOptionsByGroupId', () => {
    it('should find options by group ID', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const productOption = await createProductOption(
        entityManager,
        optionGroup,
      );

      const results = await productOptionsService.findOptionsByGroupId(
        optionGroup.id,
      );

      expect(results).toMatchObject([
        {
          id: productOption.id,
          name: productOption.name,
          displayName: productOption.displayName,
          basePrice: productOption.basePrice.toString(),
          isActive: productOption.isActive,
          optionGroupId: optionGroup.id,
          createdAt: productOption.createdAt,
          updatedAt: productOption.updatedAt,
        },
      ]);
    });
  });

  describe('create', () => {
    it('should create an option', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );

      const createOptionInput = {
        name: 'Large',
        displayName: 'L',
        optionGroupId: optionGroup.id,
        basePrice: 5.0,
        isActive: true,
      };

      const result = await productOptionsService.create(createOptionInput);

      expect(result).toMatchObject({
        id: expect.any(String),
        name: 'Large',
        displayName: 'L',
        basePrice: 5,
        isActive: true,
        optionGroupId: optionGroup.id,
      });
    });
  });

  describe('update', () => {
    it('should update an option', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const productOption = await createProductOption(
        entityManager,
        optionGroup,
      );

      const updateOptionInput = {
        displayName: 'Large',
        basePrice: 6.0,
      };

      const result = await productOptionsService.update(
        productOption.id,
        updateOptionInput,
      );

      expect(result).toMatchObject({
        id: productOption.id,
        name: productOption.name,
        displayName: 'Large',
        basePrice: 6,
        isActive: productOption.isActive,
        optionGroupId: optionGroup.id,
        createdAt: productOption.createdAt,
      });

      expect(result.updatedAt.getTime()).toBeGreaterThan(
        productOption.updatedAt.getTime(),
      );
    });

    it('should throw NotFoundException when updating non-existent option', async () => {
      const updateOptionInput = {
        displayName: 'Test',
      };

      const id = createUUID();

      await expect(
        productOptionsService.update(id, updateOptionInput),
      ).rejects.toThrow(`Option with ID ${id} not found`);
    });
  });

  describe('remove', () => {
    it('should remove an option', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const productOption = await createProductOption(
        entityManager,
        optionGroup,
      );

      await productOptionsService.remove(productOption.id);

      const result = await entityManager.findOne(ProductOption, {
        where: { id: productOption.id },
      });

      expect(result).toBeNull();
    });

    it('should throw NotFoundException when deactivating non-existent option', async () => {
      const id = createUUID();

      await expect(productOptionsService.remove(id)).rejects.toThrow(
        `Option with ID ${id} not found`,
      );
    });
  });
});
