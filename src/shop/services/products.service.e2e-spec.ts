import { INestApplication, NotFoundException } from '@nestjs/common';
import { App } from 'supertest/types';
import { EntityManager } from 'typeorm';
import { createUUID } from '@Common/utils/create-uuid';
import { ProductCategory } from '@Shop/entities/product-category.entity';
import { CreateProductInput } from '@Shop/types/create-product.input';
import { InventoryService } from '@Shop/services/inventory.service';
import { OptionRulesService } from '@Shop/services/option-rules.service';
import { RuleType } from '@Shop/entities/rule-type';
import { ProductOption } from '@Shop/entities/product-option.entity';
import { PricingService } from '@Shop/services/pricing.service';
import { Product } from '@Shop/entities/product.entity';
import { createTestApp } from '../../../test/create-test.app';
import { ProductsService } from './products.service';
import { createProduct } from '../../../test/helpers/create-product';
import { createProductOptionGroup } from '../../../test/helpers/create-product-option-group';
import { createProductCategory } from '../../../test/helpers/create-product-category';
import { createProductOption } from '../../../test/helpers/create-product-option';

describe('ProductsService', () => {
  let app: INestApplication<App>;
  let entityManager: EntityManager;
  let productsService: ProductsService;

  beforeEach(async () => {
    app = await createTestApp();

    entityManager = app.get<EntityManager>(EntityManager);
    productsService = app.get<ProductsService>(ProductsService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('getAll()', () => {
    it('should get a list of all active products', async () => {
      const productCategory = await createProductCategory(entityManager);
      await createProduct(entityManager, {
        categoryId: productCategory.id,
      });

      const result = await productsService.getAll();

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          }),
        ]),
      );
    });

    it('should filter products by categoryName', async () => {
      const categoryName = `Bicycle-${createUUID()}`;
      const productCategory = await createProductCategory(entityManager, {
        name: categoryName,
      });
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const result = await productsService.getAll(categoryName);

      expect(result[0]).toMatchObject({
        id: product.id,
      });
    });
  });

  describe('getById()', () => {
    it('should get a product by ID', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const result = await productsService.getById(product.id);

      expect(result).toMatchObject({
        id: product.id,
        name: product.name,
      });
    });

    it('should get an error if Product does not exist', async () => {
      const nonExistentId = createUUID();
      await expect(productsService.getById(nonExistentId)).rejects.toThrow(
        new NotFoundException(`Product with ID ${nonExistentId} not found`),
      );
    });
  });

  describe('create()', () => {
    it('should create a product with valid input', async () => {
      const category = await entityManager.save(ProductCategory, {
        name: `Category-${createUUID()}`,
        description: 'Test category',
      });

      const input: CreateProductInput = {
        name: `Product`,
        description: 'Test product',
        basePrice: 99.99,
        isActive: true,
        categoryId: category.id,
      };

      const result = await productsService.create(input);
      expect(result).toMatchObject(input);
    });

    it('should get an error if Category does not exist', async () => {
      const input: CreateProductInput = {
        name: 'Test Product',
        description: 'Test product',
        basePrice: 99.99,
        isActive: true,
        categoryId: createUUID(),
      };

      await expect(productsService.create(input)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update()', () => {
    it('should update an existing product', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const updateInput = {
        name: 'Updated Name',
        basePrice: 149.99,
      };

      const result = await productsService.update(product.id, updateInput);

      expect(result).toMatchObject({
        id: product.id,
        name: 'Updated Name',
        description: product.description,
        basePrice: 149.99,
        isActive: product.isActive,
        categoryId: productCategory.id,
        createdAt: product.createdAt,
        category: {
          id: productCategory.id,
          name: productCategory.name,
          description: productCategory.description,
          isActive: product.isActive,
          createdAt: productCategory.createdAt,
          updatedAt: productCategory.updatedAt,
        },
        optionGroups: [],
      });

      expect(result.updatedAt.getTime()).toBeGreaterThan(
        product.updatedAt.getTime(),
      );
    });

    it('should get an error if Product does not exist', async () => {
      await expect(
        productsService.update(createUUID(), { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('should soft delete a product by setting isActive to false', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });

      await productsService.remove(product.id);

      const result = await entityManager.findOne(Product, {
        where: { id: product.id },
      });
      expect(result).toBeNull();
    });

    it('should get an error if Product does not exist', async () => {
      await expect(productsService.remove(createUUID())).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProductConfiguration()', () => {
    it('should return product configuration with options and rules', async () => {
      jest
        .spyOn(InventoryService.prototype, 'getInventoryStatusForProduct')
        .mockResolvedValue([
          {
            productOptionId: 'option-1',
            inStock: true,
            quantity: 9,
          },
        ]);

      const now = new Date();

      const expectedRules = [
        {
          id: 'rule-1',
          ifOptionId: 'option-1',
          ifOption: { id: 'option-1' } as ProductOption,
          thenOptionId: 'option-2',
          thenOption: { id: 'option-2' } as ProductOption,
          ruleType: RuleType.REQUIRES,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
      ];

      jest
        .spyOn(OptionRulesService.prototype, 'findRulesByProductId')
        .mockResolvedValue(expectedRules);

      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup = await createProductOptionGroup(
        entityManager,
        product,
      );
      const productConfiguration =
        await productsService.getProductConfiguration(product.id);

      expect(productConfiguration).toMatchObject({
        product: {
          id: product.id,
          name: product.name,
          description: 'Trailblazer Pro description',
          basePrice: 72.99,
          isActive: true,
          categoryId: product.categoryId,
          optionGroups: [
            {
              id: optionGroup.id,
              name: optionGroup.name,
              displayName: 'Wheels',
              createdAt: optionGroup.createdAt.toISOString(),
              updatedAt: optionGroup.updatedAt.toISOString(),
            },
          ],
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString(),
        },
        optionGroups: [
          {
            id: optionGroup.id,
            name: optionGroup.name,
            displayName: 'Wheels',
            createdAt: optionGroup.createdAt.toISOString(),
            updatedAt: optionGroup.updatedAt.toISOString(),
          },
        ],
        rules: [
          {
            id: 'rule-1',
            ruleType: 'requires',
            ifOptionId: 'option-1',
            ifOption: {
              id: 'option-1',
              basePrice: null,
            },
            thenOptionId: 'option-2',
            thenOption: {
              id: 'option-2',
              basePrice: null,
            },
            isActive: true,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
          },
        ],
      });
    });

    it('should get an error if Product does not exist', async () => {
      await expect(
        productsService.getProductConfiguration(createUUID()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('calculateProductPrice()', () => {
    it('should calculate total price with selected options', async () => {
      const productCategory = await createProductCategory(entityManager);
      const product = await createProduct(entityManager, {
        categoryId: productCategory.id,
      });
      const optionGroup1 = await createProductOptionGroup(
        entityManager,
        product,
      );
      const option1 = await createProductOption(entityManager, optionGroup1);

      const optionsPrice = 12.99;

      jest
        .spyOn(PricingService.prototype, 'calculateOptionsPrice')
        .mockResolvedValue(optionsPrice);

      const totalPrice = await productsService.calculateProductPrice(
        product.id,
        [option1.id],
      );

      expect(totalPrice).toEqual(85.98);
    });

    it('should get an error if Product does not exist', async () => {
      await expect(
        productsService.calculateProductPrice(createUUID(), [createUUID()]),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
