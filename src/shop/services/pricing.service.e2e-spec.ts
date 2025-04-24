import { EntityManager } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { createUUID } from '@Common/utils/create-uuid';
import { PricingService } from './pricing.service';
import { createTestApp } from '../../../test/create-test.app';
import { createProductOption } from '../../../test/helpers/create-product-option';
import { createProductOptionGroup } from '../../../test/helpers/create-product-option-group';
import { createProduct } from '../../../test/helpers/create-product';
import { createOptionPriceRule } from '../../../test/helpers/create-option-price-rule';
import { createProductCategory } from '../../../test/helpers/create-product-category';

describe('PricingService', () => {
  let app: INestApplication;
  let entityManager: EntityManager;
  let pricingService: PricingService;

  beforeEach(async () => {
    app = await createTestApp();

    entityManager = app.get<EntityManager>(EntityManager);
    pricingService = app.get<PricingService>(PricingService);
  });

  describe('calculateOptionsPrice', () => {
    it('should calculate total price with single option', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option = await createProductOption(entityManager, optionGroup, {
        basePrice: 10,
      });

      const totalPrice = await pricingService.calculateOptionsPrice([
        option.id,
      ]);
      expect(totalPrice).toBe(10);
    });

    it('should calculate total price with multiple options', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option1 = await createProductOption(entityManager, optionGroup, {
        basePrice: 10,
        name: 'Option 1',
      });
      const option2 = await createProductOption(entityManager, optionGroup, {
        basePrice: 20,
        name: 'Option 2',
      });

      const totalPrice = await pricingService.calculateOptionsPrice([
        option1.id,
        option2.id,
      ]);
      expect(totalPrice).toBe(30);
    });

    it('should apply price rule when selecting dependent options', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup1 = await createProductOptionGroup(
        entityManager,
        product,
        {
          name: 'Frame Type',
          displayName: 'Frame Type',
        },
      );
      const optionGroup2 = await createProductOptionGroup(
        entityManager,
        product,
        {
          name: 'Frame Finish',
          displayName: 'Frame Finish',
        },
      );
      const option1 = await createProductOption(entityManager, optionGroup1, {
        name: 'Full-suspension',
        displayName: 'Full-suspension',
        basePrice: 130,
      });
      const option2 = await createProductOption(entityManager, optionGroup1, {
        name: 'Diamond',
        displayName: 'Diamond',
        basePrice: 100,
      });
      const option3 = await createProductOption(entityManager, optionGroup2, {
        name: 'Matte',
        displayName: 'Matte',
        basePrice: 40,
      });

      await createOptionPriceRule(entityManager, option1, option3, {
        price: 50,
      });
      await createOptionPriceRule(entityManager, option2, option3, {
        price: 35,
      });

      const result1 = await pricingService.calculateOptionsPrice([
        option1.id,
        option3.id,
      ]);
      expect(result1).toBe(180);

      const result2 = await pricingService.calculateOptionsPrice([
        option2.id,
        option3.id,
      ]);
      expect(result2).toBe(135);
    });

    it('should return 0 for empty option list', async () => {
      const totalPrice = await pricingService.calculateOptionsPrice([]);
      expect(totalPrice).toBe(0);
    });

    it('should ignore inactive options', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option = await createProductOption(entityManager, optionGroup, {
        basePrice: 10,
        isActive: false,
      });

      const totalPrice = await pricingService.calculateOptionsPrice([
        option.id,
      ]);
      expect(totalPrice).toBe(0);
    });
  });

  describe('createPriceRule', () => {
    it('should create a price rule between two options', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option1 = await createProductOption(entityManager, optionGroup, {
        basePrice: 10,
        name: 'Option 1',
      });
      const option2 = await createProductOption(entityManager, optionGroup, {
        basePrice: 20,
        name: 'Option 2',
      });

      const priceRule = await pricingService.createPriceRule(
        option1.id,
        option2.id,
        25,
      );

      expect(priceRule).toBeDefined();
      expect(priceRule.price).toBe(25);
      expect(priceRule.targetOptionId).toBe(option1.id);
      expect(priceRule.dependentOptionId).toBe(option2.id);
    });

    it('should throw error when creating rule with same option', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option = await createProductOption(entityManager, optionGroup, {
        basePrice: 10,
      });

      await expect(
        pricingService.createPriceRule(option.id, option.id, 15),
      ).rejects.toThrow();
    });

    it('should throw error when option does not exist', async () => {
      const nonExistentId = createUUID();
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option = await createProductOption(entityManager, optionGroup, {
        basePrice: 10,
      });

      await expect(
        pricingService.createPriceRule(option.id, nonExistentId, 15),
      ).rejects.toThrow();
    });

    it('should not create duplicate price rules', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option1 = await createProductOption(entityManager, optionGroup, {
        basePrice: 10,
      });
      const option2 = await createProductOption(entityManager, optionGroup, {
        basePrice: 20,
      });

      await pricingService.createPriceRule(option1.id, option2.id, 25);

      await expect(
        pricingService.createPriceRule(option1.id, option2.id, 30),
      ).rejects.toThrow();
    });
  });
});
