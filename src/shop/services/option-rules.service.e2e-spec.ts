import { EntityManager } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { OptionRulesService } from './option-rules.service';
import { createTestApp } from '../../../test/create-test.app';
import { createProduct } from '../../../test/helpers/create-product';
import { createProductOption } from '../../../test/helpers/create-product-option';
import { RuleType } from '../entities/rule-type';
import { createProductOptionGroup } from '../../../test/helpers/create-product-option-group';
import { createOptionRule } from '../../../test/helpers/create-option-rule';
import { createProductCategory } from '../../../test/helpers/create-product-category';

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

  describe('createRule()', () => {
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

      const rule = await optionRulesService.createRule(
        productOption1.id,
        productOption2.id,
        RuleType.REQUIRES,
      );

      expect(rule).toMatchObject({
        id: expect.any(String),
        ifOptionId: productOption1.id,
        thenOptionId: productOption2.id,
        ruleType: RuleType.REQUIRES,
        isActive: true,
      });
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
      const option2 = await createProductOption(entityManager, optionGroup);
      const rule = await createOptionRule(
        entityManager,
        option1.id,
        option2.id,
        RuleType.REQUIRES,
      );

      const rules = await optionRulesService.findRulesByProductId(product.id);

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
      await createProductOption(entityManager, optionGroup);

      const rules = await optionRulesService.findRulesByProductId(product.id);

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
      const option2 = await createProductOption(entityManager, optionGroup);
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
      const option2 = await createProductOption(entityManager, optionGroup);
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
      const option2 = await createProductOption(entityManager, optionGroup1);
      const option3 = await createProductOption(entityManager, optionGroup1);
      const option4 = await createProductOption(entityManager, optionGroup2);
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
