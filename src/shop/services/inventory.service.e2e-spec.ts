import { EntityManager } from 'typeorm';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { createUUID } from '@Common/utils/create-uuid';
import { InventoryItem } from '@Shop/entities/inventory-item.entity';
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

  describe('getAll()', () => {
    it('should return all option InventoryItems', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option1 = await createProductOption(entityManager, optionGroup);
      await createInventoryItem(entityManager, {
        productOptionId: option1.id,
        quantity: 10,
        outOfStock: false,
      });
      const option2 = await createProductOption(entityManager, optionGroup);
      await createInventoryItem(entityManager, {
        productOptionId: option2.id,
        quantity: 10,
        outOfStock: false,
      });

      const inventoryItems = await inventoryService.getAll();

      expect(inventoryItems[0]).toMatchObject({});
    });
  });

  describe('getById()', () => {
    it('should return InventoryItem by id', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option1 = await createProductOption(entityManager, optionGroup);
      const inventoryItem = await createInventoryItem(entityManager, {
        productOptionId: option1.id,
        quantity: 10,
        outOfStock: false,
      });

      const foundRule = await inventoryService.getById(inventoryItem.id);

      expect(foundRule).toMatchObject({});
    });

    it('should return an error when InventoryItem does not exist', async () => {
      const nonExistentId = createUUID();
      await expect(inventoryService.getById(nonExistentId)).rejects.toThrow(
        new NotFoundException(
          `InventoryItem with ID ${nonExistentId} not found`,
        ),
      );
    });
  });

  describe('getInventoryByProduct()', () => {
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

      const result = await inventoryService.getInventoryByProduct(product.id);

      expect(result).toMatchObject({
        productOptionId: productOption.id,
        quantity: inventoryItem.quantity,
        outOfStock: false,
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
      const inventoryItem = await createInventoryItem(entityManager, {
        productOptionId: productOption.id,
        quantity: 10,
        outOfStock: false,
      });

      const result = await inventoryService.getInventoryByProduct(product.id);

      expect(result).toMatchObject({
        productOptionId: productOption.id,
        quantity: inventoryItem.quantity,
        outOfStock: false,
      });
    });
  });

  describe('create()', () => {
    it('should create a new option InventoryItem', async () => {
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

      const inventoryItem = await inventoryService.create({
        productOptionId: productOption1.id,
        quantity: 10,
        outOfStock: true,
      });

      expect(inventoryItem).toMatchObject({});
    });
  });

  describe('update()', () => {
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
      const inventoryItem = await createInventoryItem(entityManager, {
        productOptionId: productOption.id,
        quantity: 10,
        outOfStock: false,
      });

      const updateInput = {
        quantity: 5,
        outOfStock: false,
      };

      const result = await inventoryService.update(
        inventoryItem.id,
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
      const inventoryItem = await createInventoryItem(entityManager, {
        productOptionId: productOption.id,
        quantity: 10,
        outOfStock: false,
      });

      const updateInput = {
        quantity: 0,
        outOfStock: true,
      };

      const result = await inventoryService.update(
        inventoryItem.id,
        updateInput,
      );

      expect(result).toMatchObject({
        productOptionId: productOption.id,
        quantity: updateInput.quantity,
        outOfStock: true,
      });
    });
  });

  describe('remove()', () => {
    it('should remove an existing InventoryItem', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option1 = await createProductOption(entityManager, optionGroup);
      await createInventoryItem(entityManager, {
        productOptionId: option1.id,
        quantity: 10,
        outOfStock: false,
      });
      const option2 = await createProductOption(entityManager, optionGroup);
      const inventoryItem = await createInventoryItem(entityManager, {
        productOptionId: option2.id,
        quantity: 10,
        outOfStock: false,
      });

      await inventoryService.remove(inventoryItem.id);

      const result = await entityManager.findOne(InventoryItem, {
        where: { id: inventoryItem.id },
      });
      expect(result).toBeNull();
    });

    it('should get an error if InventoryItem does not exist', async () => {
      await expect(inventoryService.remove(createUUID())).rejects.toThrow();
    });
  });
});
