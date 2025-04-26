import { EntityManager } from 'typeorm';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { createUUID } from '@Common/utils/create-uuid';
import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { createTestApp } from '../../../test/create-test.app';
import { createProduct } from '../../../test/helpers/create-product';
import { createProductOption } from '../../../test/helpers/create-product-option';
import { createProductOptionGroup } from '../../../test/helpers/create-product-option-group';
import { createProductCategory } from '../../../test/helpers/create-product-category';
import { createInventoryItem } from '../../../test/helpers/create-inventory-item';
import { OptionPriceRulesService } from './option-price-rules.service';
import { createOptionPriceRule } from '../../../test/helpers/create-option-price-rule';

describe('OptionPriceRulesService', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let optionPriceRulesService: OptionPriceRulesService;

  beforeEach(async () => {
    app = await createTestApp();

    entityManager = app.get<EntityManager>(EntityManager);
    optionPriceRulesService = app.get<OptionPriceRulesService>(
      OptionPriceRulesService,
    );
  });

  afterEach(async () => {
    await app.close();
  });

  describe('getAll()', () => {
    it('should return all OptionPriceRules', async () => {
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

      const priceRule = await createOptionPriceRule(
        entityManager,
        option1,
        option2,
        {
          price: 10,
          isActive: true,
        },
      );

      const rules = await optionPriceRulesService.getAll();

      expect(rules[0]).toMatchObject({
        id: priceRule.id,
        price: '10.00',
        targetOptionId: priceRule.targetOptionId,
        dependentOptionId: priceRule.dependentOptionId,
        isActive: priceRule.isActive,
        createdAt: priceRule.createdAt,
        updatedAt: priceRule.updatedAt,
      });
    });
  });

  describe('getById()', () => {
    it('should return rule by id', async () => {
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
      const priceRule = await createOptionPriceRule(
        entityManager,
        option1,
        option2,
        {
          price: 10,
          isActive: true,
        },
      );

      const foundRule = await optionPriceRulesService.getById(priceRule.id);

      expect(foundRule).toMatchObject({
        id: priceRule.id,
        price: priceRule.price.toFixed(2),
        targetOptionId: priceRule.targetOptionId,
        dependentOptionId: priceRule.dependentOptionId,
        isActive: priceRule.isActive,
        createdAt: priceRule.createdAt,
        updatedAt: priceRule.updatedAt,
      });
    });

    it('should return an error when rule does not exist', async () => {
      const nonExistentId = createUUID();
      await expect(
        optionPriceRulesService.getById(nonExistentId),
      ).rejects.toThrow(
        new NotFoundException(
          `OptionPriceRule with ID ${nonExistentId} not found`,
        ),
      );
    });
  });

  describe('create()', () => {
    it('should create a new OptionPriceRule', async () => {
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

      const rule = await optionPriceRulesService.create({
        price: 79.99,
        targetOptionId: productOption1.id,
        dependentOptionId: productOption2.id,
        isActive: true,
      });

      expect(rule).toMatchObject({
        id: expect.any(String),
        price: 79.99,
        targetOptionId: productOption1.id,
        dependentOptionId: productOption2.id,
        isActive: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('update()', () => {
    it('should update an existing rule', async () => {
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
      const option3 = await createProductOption(entityManager, optionGroup);
      await createInventoryItem(entityManager, {
        productOptionId: option3.id,
        quantity: 10,
        outOfStock: false,
      });
      const priceRule = await createOptionPriceRule(
        entityManager,
        option1,
        option2,
        {
          price: 10,
          isActive: true,
        },
      );

      const updatedRule = await optionPriceRulesService.update(priceRule.id, {
        price: 79.99,
        targetOptionId: option1.id,
        dependentOptionId: option3.id,
        isActive: true,
      });

      expect(updatedRule).toMatchObject({
        id: priceRule.id,
        price: 79.99,
        targetOptionId: option1.id,
        dependentOptionId: option3.id,
        isActive: priceRule.isActive,
        createdAt: priceRule.createdAt,
      });

      expect(updatedRule.updatedAt.getTime()).toBeGreaterThan(
        priceRule.updatedAt.getTime(),
      );
    });

    it('should get an error if OptionRule does not exist', async () => {
      await expect(
        optionPriceRulesService.update(createUUID(), {
          price: 79.99,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('should remove an existing rule', async () => {
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
      const priceRule = await createOptionPriceRule(
        entityManager,
        option1,
        option2,
        {
          price: 10,
          isActive: true,
        },
      );

      await optionPriceRulesService.remove(priceRule.id);

      const result = await entityManager.findOne(OptionPriceRule, {
        where: { id: priceRule.id },
      });
      expect(result).toBeNull();
    });

    it('should get an error if OptionRule does not exist', async () => {
      await expect(
        optionPriceRulesService.remove(createUUID()),
      ).rejects.toThrow();
    });
  });
});
