import { EntityManager } from 'typeorm';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { createUUID } from '@Common/utils/create-uuid';
import { OptionRule } from '@Shop/entities/option-rule.entity';
import { OptionRulesService } from './option-rules.service';
import { createTestApp } from '../../../test/create-test.app';
import { createProduct } from '../../../test/helpers/create-product';
import { createProductOption } from '../../../test/helpers/create-product-option';
import { RuleType } from '../entities/rule-type';
import { createProductOptionGroup } from '../../../test/helpers/create-product-option-group';
import { createOptionRule } from '../../../test/helpers/create-option-rule';
import { createProductCategory } from '../../../test/helpers/create-product-category';
import { createInventoryItem } from '../../../test/helpers/create-inventory-item';

describe('OptionRulesService', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let optionRulesService: OptionRulesService;

  beforeEach(async () => {
    app = await createTestApp();

    entityManager = app.get<EntityManager>(EntityManager);
    optionRulesService = app.get<OptionRulesService>(OptionRulesService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('getAll()', () => {
    it('should return all option rules', async () => {
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
      const rule = await createOptionRule(
        entityManager,
        option1.id,
        option2.id,
        RuleType.REQUIRES,
      );

      const rules = await optionRulesService.getAll();

      expect(rules[0]).toMatchObject({
        id: rule.id,
        ifOptionId: option1.id,
        thenOptionId: option2.id,
        ruleType: RuleType.REQUIRES,
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
      const rule = await createOptionRule(
        entityManager,
        option1.id,
        option2.id,
        RuleType.REQUIRES,
      );

      const foundRule = await optionRulesService.getById(rule.id);

      expect(foundRule).toMatchObject({
        id: rule.id,
        ifOptionId: option1.id,
        thenOptionId: option2.id,
        ruleType: RuleType.REQUIRES,
      });
    });

    it('should return an error when rule does not exist', async () => {
      const nonExistentId = createUUID();
      await expect(optionRulesService.getById(nonExistentId)).rejects.toThrow(
        new NotFoundException(`OptionRule with ID ${nonExistentId} not found`),
      );
    });
  });

  describe('create()', () => {
    it('should create a new option rule', async () => {
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

      const rule = await optionRulesService.create({
        ifOptionId: productOption1.id,
        thenOptionId: productOption2.id,
        ruleType: RuleType.REQUIRES,
      });

      expect(rule).toMatchObject({
        id: expect.any(String),
        ifOptionId: productOption1.id,
        thenOptionId: productOption2.id,
        ruleType: RuleType.REQUIRES,
        isActive: true,
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
      const rule = await createOptionRule(
        entityManager,
        option1.id,
        option2.id,
        RuleType.REQUIRES,
      );

      const updatedRule = await optionRulesService.update(rule.id, {
        ruleType: RuleType.EXCLUDES,
      });

      expect(updatedRule).toMatchObject({
        id: rule.id,
        ifOptionId: option1.id,
        thenOptionId: option2.id,
        ruleType: RuleType.EXCLUDES,
        isActive: true,
      });
    });

    it('should get an error if OptionRule does not exist', async () => {
      await expect(
        optionRulesService.update(createUUID(), {
          ruleType: RuleType.EXCLUDES,
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
      const rule = await createOptionRule(
        entityManager,
        option1.id,
        option2.id,
        RuleType.REQUIRES,
      );

      await optionRulesService.remove(rule.id);

      const result = await entityManager.findOne(OptionRule, {
        where: { id: rule.id },
      });
      expect(result).toBeNull();
    });

    it('should get an error if OptionRule does not exist', async () => {
      await expect(optionRulesService.remove(createUUID())).rejects.toThrow();
    });
  });

  describe('findRulesByProductId()', () => {
    it('should find all rules for a product', async () => {
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
      const rule = await createOptionRule(
        entityManager,
        option1.id,
        option2.id,
        RuleType.REQUIRES,
      );

      const rules = await optionRulesService.getRulesByProductId(product.id);

      expect(rules).toHaveLength(1);
      expect(rules[0]).toMatchObject({
        id: rule.id,
        ifOptionId: option1.id,
        thenOptionId: option2.id,
        ruleType: RuleType.REQUIRES,
      });
    });

    it('should return empty array when no option rules are defined for a product', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option = await createProductOption(entityManager, optionGroup);
      await createInventoryItem(entityManager, {
        productOptionId: option.id,
        quantity: 10,
        outOfStock: false,
      });

      const rules = await optionRulesService.getRulesByProductId(product.id);

      expect(rules).toHaveLength(0);
    });
  });

  describe('validateConfiguration()', () => {
    it('should throw BadRequestException when no product ID is provided', async () => {
      await expect(
        optionRulesService.validateConfiguration('', []),
      ).rejects.toThrow('Product ID and at least one option ID are required');
    });

    it('should throw BadRequestException when no options are provided', async () => {
      await expect(
        optionRulesService.validateConfiguration('some-id', []),
      ).rejects.toThrow('Product ID and at least one option ID are required');
    });

    it('should validate configuration with REQUIRES rule', async () => {
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
      await createOptionRule(
        entityManager,
        option1.id,
        option2.id,
        RuleType.REQUIRES,
      );

      const validResult = await optionRulesService.validateConfiguration(
        product.id,
        [option1.id, option2.id],
      );
      expect(validResult).toBe(true);

      const invalidResult = await optionRulesService.validateConfiguration(
        product.id,
        [option1.id],
      );
      expect(invalidResult).toBe(false);
    });

    it('should validate configuration with EXCLUDES rule', async () => {
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
      await createOptionRule(
        entityManager,
        option1.id,
        option2.id,
        RuleType.EXCLUDES,
      );

      const validResult = await optionRulesService.validateConfiguration(
        product.id,
        [option1.id],
      );
      expect(validResult).toBe(true);

      const invalidResult = await optionRulesService.validateConfiguration(
        product.id,
        [option1.id, option2.id],
      );
      expect(invalidResult).toBe(false);
    });

    it('should validate configuration with ONLY_ALLOWS rule', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup1 = await createProductOptionGroup(
        entityManager,
        product,
      );
      const optionGroup2 = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option1 = await createProductOption(entityManager, optionGroup1);
      await createInventoryItem(entityManager, {
        productOptionId: option1.id,
        quantity: 10,
        outOfStock: false,
      });
      const option2 = await createProductOption(entityManager, optionGroup1);
      await createInventoryItem(entityManager, {
        productOptionId: option2.id,
        quantity: 10,
        outOfStock: false,
      });
      const option3 = await createProductOption(entityManager, optionGroup1);
      await createInventoryItem(entityManager, {
        productOptionId: option3.id,
        quantity: 10,
        outOfStock: false,
      });
      const option4 = await createProductOption(entityManager, optionGroup2);
      await createInventoryItem(entityManager, {
        productOptionId: option4.id,
        quantity: 10,
        outOfStock: false,
      });
      await createOptionRule(
        entityManager,
        option1.id,
        option2.id,
        RuleType.ONLY_ALLOWS,
      );

      const validResult1 = await optionRulesService.validateConfiguration(
        product.id,
        [option1.id, option2.id],
      );
      expect(validResult1).toBe(true);

      const invalidResult = await optionRulesService.validateConfiguration(
        product.id,
        [option1.id, option3.id],
      );

      const validResult2 = await optionRulesService.validateConfiguration(
        product.id,
        [option1.id, option2.id, option4.id],
      );
      expect(validResult2).toBe(true);

      expect(invalidResult).toBe(false);
    });
  });
});
