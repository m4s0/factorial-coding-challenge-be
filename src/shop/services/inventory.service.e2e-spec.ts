import { EntityManager } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { createTestApp } from '../../../test/create-test.app';
import { createProduct } from '../../../test/helpers/create-product';
import { createProductOption } from '../../../test/helpers/create-product-option';
import { createInventoryItem } from '../../../test/helpers/create-inventory-item';
import { createProductOptionGroup } from '../../../test/helpers/create-product-option-group';
import { createProductCategory } from '../../../test/helpers/create-product-category';

describe('InventoryService', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let inventoryService: InventoryService;

  beforeEach(async () => {
    app = await createTestApp();

    entityManager = app.get<EntityManager>(EntityManager);
    inventoryService = app.get<InventoryService>(InventoryService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('getInventoryStatusForProduct()', () => {
    it('should get inventory status for all product options', async () => {
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

      const result = await inventoryService.getInventoryStatusForProduct(
        product.id,
      );

      expect(result[0]).toMatchObject({
        productOptionId: productOption.id,
        quantity: inventoryItem.quantity,
        inStock: true,
      });
    });

    it('should return zero quantity for options without inventory', async () => {
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

      const result = await inventoryService.getInventoryStatusForProduct(
        product.id,
      );

      expect(result[0]).toMatchObject({
        productOptionId: productOption.id,
        quantity: 0,
        inStock: true,
      });
    });
  });

  describe('updateInventory()', () => {
    it('should create new inventory item if it does not exist', async () => {
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

      const updateInput = {
        quantity: 5,
        outOfStock: false,
      };

      const result = await inventoryService.updateInventory(
        productOption.id,
        updateInput,
      );

      expect(result).toMatchObject({
        productOptionId: productOption.id,
        quantity: updateInput.quantity,
        outOfStock: false,
      });
    });

    it('should update existing inventory item', async () => {
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
      await createInventoryItem(entityManager, {
        productOptionId: productOption.id,
        quantity: 10,
        outOfStock: false,
      });

      const updateInput = {
        quantity: 0,
        outOfStock: true,
      };

      const result = await inventoryService.updateInventory(
        productOption.id,
        updateInput,
      );

      expect(result).toMatchObject({
        productOptionId: productOption.id,
        quantity: updateInput.quantity,
        outOfStock: true,
      });
    });
  });

  describe('checkInventoryAvailability()', () => {
    it('should return true when all options are in stock', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const productOption1 = await createProductOption(
        entityManager,
        optionGroup,
      );
      const productOption2 = await createProductOption(
        entityManager,
        optionGroup,
      );

      await createInventoryItem(entityManager, {
        productOptionId: productOption1.id,
        quantity: 5,
        outOfStock: false,
      });
      await createInventoryItem(entityManager, {
        productOptionId: productOption2.id,
        quantity: 3,
        outOfStock: false,
      });

      const result = await inventoryService.checkInventoryAvailability([
        productOption1.id,
        productOption2.id,
      ]);

      expect(result).toBe(true);
    });

    it('should return false when any option is out of stock', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const productOption1 = await createProductOption(
        entityManager,
        optionGroup,
      );
      const productOption2 = await createProductOption(
        entityManager,
        optionGroup,
      );

      await createInventoryItem(entityManager, {
        productOptionId: productOption1.id,
        quantity: 5,
        outOfStock: false,
      });
      await createInventoryItem(entityManager, {
        productOptionId: productOption2.id,
        quantity: 0,
        outOfStock: true,
      });

      const result = await inventoryService.checkInventoryAvailability([
        productOption1.id,
        productOption2.id,
      ]);

      expect(result).toBe(false);
    });

    it('should return false when inventory item does not exist', async () => {
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

      const result = await inventoryService.checkInventoryAvailability([
        productOption.id,
      ]);

      expect(result).toBe(false);
    });
  });
});
