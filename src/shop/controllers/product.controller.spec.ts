import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ProductsService } from '@Shop/services/products.service';
import { ProductOutput } from '@Shop/types/product.output';
import { ProductOptionGroupOutput } from '@Shop/types/product-option-group.output';
import { OptionRuleOutput } from '@Shop/types/option-rule.output';
import { ProductCategory } from '@Shop/entities/product-category.entity';
import { Product } from '@Shop/entities/product.entity';
import { OptionRulesService } from '@Shop/services/option-rules.service';
import { ProductOptionGroup } from '@Shop/entities/product-option-group.entity';
import { InventoryService } from '@Shop/services/inventory.service';
import { InventoryItem } from '@Shop/entities/inventory-item.entity';
import { OptionRule } from '@Shop/entities/option-rule.entity';
import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { ProductOption } from '@Shop/entities/product-option.entity';
import { createUUID } from '@Common/utils/create-uuid';
import { createTestApp } from '../../../test/create-test.app';

describe('ProductController', () => {
  let app: INestApplication<App>;
  let productsService: ProductsService;
  let inventoryService: InventoryService;
  let optionRulesService: OptionRulesService;

  const mockProduct = {
    name: 'Test Product',
    description: 'Test description',
    basePrice: 72.99,
    isActive: true,
    categoryId: '5a4979e1-0791-4bf0-88cd-2c47f0ae540a',
    category: {
      id: '5a4979e1-0791-4bf0-88cd-2c47f0ae540a',
      name: 'Category',
      description: 'Test category',
      isActive: true,
      products: [] as Product[],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    } as ProductCategory,
    optionGroups: [],
    id: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  beforeEach(async () => {
    app = await createTestApp();

    productsService = app.get<ProductsService>(ProductsService);
    inventoryService = app.get<InventoryService>(InventoryService);
    optionRulesService = app.get<OptionRulesService>(OptionRulesService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /products', () => {
    it('should return all products', async () => {
      jest
        .spyOn(ProductsService.prototype, 'getAll')
        .mockResolvedValue([mockProduct]);

      const response = await request(app.getHttpServer()).get('/products');

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject([
        {
          id: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
          name: 'Test Product',
          description: 'Test description',
          basePrice: 72.99,
          isActive: true,
          categoryId: '5a4979e1-0791-4bf0-88cd-2c47f0ae540a',
          category: {
            id: '5a4979e1-0791-4bf0-88cd-2c47f0ae540a',
            name: 'Category',
            description: 'Test category',
            isActive: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z',
          },
          optionGroups: [],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
      ]);
    });
  });

  describe('GET /products/:productId', () => {
    it('should return a single product', async () => {
      jest
        .spyOn(ProductsService.prototype, 'getById')
        .mockResolvedValue(mockProduct);

      jest
        .spyOn(InventoryService.prototype, 'getInventoryByProduct')
        .mockResolvedValue({
          id: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
          quantity: 15,
          outOfStock: true,
          productOptionId: '7ba7b5bd-2390-43d6-9893-e959068a1116',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as InventoryItem);

      const response = await request(app.getHttpServer()).get(
        `/products/${mockProduct.id}`,
      );

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
        name: 'Test Product',
        description: 'Test description',
        basePrice: 72.99,
        isActive: true,
        categoryId: '5a4979e1-0791-4bf0-88cd-2c47f0ae540a',
        category: {
          id: '5a4979e1-0791-4bf0-88cd-2c47f0ae540a',
          name: 'Category',
          description: 'Test category',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
        optionGroups: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
    });
  });

  describe('GET /products/:productId/configuration', () => {
    it('should return product configuration', async () => {
      const mockConfig = {
        product: {} as ProductOutput,
        optionGroups: [] as ProductOptionGroupOutput[],
        rules: [] as OptionRuleOutput[],
      };

      jest
        .spyOn(ProductsService.prototype, 'getProductConfiguration')
        .mockResolvedValue(mockConfig);

      const response = await request(app.getHttpServer())
        .get(`/products/${mockProduct.id}/configuration`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject(mockConfig);
    });
  });

  describe('GET /products/:productId/with-options', () => {
    it('should validate product configuration', async () => {
      const productId = 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61';
      const productOptionIds = [
        'bb88c5fd-e2fb-4d9a-9dd0-4a0f69228c62',
        '5dd40b65-034e-4ca8-b991-af3804cb08c8',
      ];

      jest
        .spyOn(ProductsService.prototype, 'getByIdAndOptions')
        .mockResolvedValue({
          id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
          name: 'Test Product',
          description: 'Test Description',
          basePrice: 99.99,
          isActive: true,
          category: {
            id: '8f7e9d2c-3b4a-5c6d-7e8f-9a0b1c2d3e4f',
            name: 'Test Category',
            isActive: true,
            description: 'Test Description',
            products: [] as Product[],
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          } as ProductCategory,
          categoryId: '8f7e9d2c-3b4a-5c6d-7e8f-9a0b1c2d3e4f',
          optionGroups: [
            {
              id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
              name: 'Test Option Group',
              displayName: 'Test Option Group',
              isActive: true,
              options: [
                {
                  id: '7ba7b5bd-2390-43d6-9893-e959068a1116',
                  name: 'Option-095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
                  displayName: 'Large',
                  basePrice: 6,
                  isActive: true,
                  optionGroupId: '095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
                  optionGroup: {
                    id: '814c6b60-2965-4464-abed-1587b4668e1e',
                    name: 'Size',
                    displayName: 'Size',
                    createdAt: new Date('2024-01-01'),
                    updatedAt: new Date('2024-01-02'),
                  } as ProductOptionGroup,
                  inventoryItemId: '5c39c75d-93a9-4c73-a7bf-ef107340fa8e',
                  inventoryItem: {
                    id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
                    quantity: 100,
                    outOfStock: false,
                    productOptionId: '13585532-a295-4a82-b7bf-0abc07064ee9',
                    createdAt: new Date('2024-01-01'),
                    updatedAt: new Date('2024-01-02'),
                  } as InventoryItem,
                  rulesAsCondition: [] as OptionRule[],
                  rulesAsResult: [] as OptionRule[],
                  priceRules: [] as OptionPriceRule[],
                  createdAt: new Date('2024-01-01'),
                  updatedAt: new Date('2024-01-02'),
                } as ProductOption,
              ],
              product: {
                id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
                name: 'Test Product',
                description: 'Test Description',
                basePrice: 99.99,
                isActive: true,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
              } as Product,
              productId: '',
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date('2024-01-01'),
            } as ProductOptionGroup,
          ],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        } as Product);

      jest
        .spyOn(InventoryService.prototype, 'getInventoryByProduct')
        .mockResolvedValue({
          id: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
          quantity: 15,
          outOfStock: true,
          productOptionId: '7ba7b5bd-2390-43d6-9893-e959068a1116',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-02'),
        } as InventoryItem);

      jest
        .spyOn(ProductsService.prototype, 'calculateProductPrice')
        .mockResolvedValue(199.99);

      jest
        .spyOn(OptionRulesService.prototype, 'validateConfiguration')
        .mockResolvedValue(true);

      const response = await request(app.getHttpServer())
        .get(`/products/${productId}/with-options`)
        .query({
          optionIds: productOptionIds,
        });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: 'd17fac76-f22a-43cb-9336-b91b3e0c2aca',
        name: 'Test Product',
        description: 'Test Description',
        basePrice: 99.99,
        isActive: true,
        categoryId: '8f7e9d2c-3b4a-5c6d-7e8f-9a0b1c2d3e4f',
        category: {
          id: '8f7e9d2c-3b4a-5c6d-7e8f-9a0b1c2d3e4f',
          name: 'Test Category',
          description: 'Test Description',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        optionGroups: [
          {
            id: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
            name: 'Test Option Group',
            displayName: 'Test Option Group',
            options: [
              {
                id: '7ba7b5bd-2390-43d6-9893-e959068a1116',
                name: 'Option-095c5e80-bee8-4695-8ed2-bc40fed5f3ca',
                displayName: 'Large',
                basePrice: 6,
                isActive: true,
                rulesAsCondition: [],
                rulesAsResult: [],
                priceRules: [],
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-02T00:00:00.000Z',
                inStock: false,
              },
            ],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
        isValidConfiguration: true,
        price: 199.99,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      });
      expect(productsService.getByIdAndOptions).toHaveBeenCalledWith(
        productId,
        productOptionIds,
      );
      expect(inventoryService.getInventoryByProduct).toHaveBeenCalledWith(
        productId,
      );
      expect(productsService.calculateProductPrice).toHaveBeenCalledWith(
        productId,
        productOptionIds,
      );
      expect(optionRulesService.validateConfiguration).toHaveBeenCalledWith(
        productId,
        productOptionIds,
      );
    });

    it('should return 400 for invalid query parameters', async () => {
      const response = await request(app.getHttpServer())
        .get(`/products/${createUUID()}/with-options`)
        .query({ optionIds: [] });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      jest
        .spyOn(ProductsService.prototype, 'create')
        .mockResolvedValue(mockProduct);

      const createProductDto = {
        name: 'Test Product',
        description: 'Test description',
        basePrice: 72.99,
        isActive: true,
        categoryId: '5a4979e1-0791-4bf0-88cd-2c47f0ae540a',
        optionGroups: [],
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto);

      expect(response.statusCode).toEqual(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        id: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
        name: 'Test Product',
        description: 'Test description',
        basePrice: 72.99,
        isActive: true,
        categoryId: '5a4979e1-0791-4bf0-88cd-2c47f0ae540a',
        category: {
          id: '5a4979e1-0791-4bf0-88cd-2c47f0ae540a',
          name: 'Category',
          description: 'Test category',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
        optionGroups: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
    });

    it('should get an error if payload is not valid', async () => {
      const invalidPayload = {};

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(invalidPayload);

      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toMatchObject({
        message: 'Validation failed',
        errors: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['name'],
            message: 'Product name is required',
          },
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['description'],
            message: 'Product description is required',
          },
          {
            code: 'invalid_type',
            expected: 'number',
            received: 'undefined',
            path: ['basePrice'],
            message: 'Base price is required',
          },
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['categoryId'],
            message: 'Category ID is required',
          },
        ],
      });
    });
  });

  describe('PUT /products/:productId', () => {
    it('should update an existing product', async () => {
      jest
        .spyOn(ProductsService.prototype, 'update')
        .mockResolvedValue(mockProduct);

      const updateProductDto = {
        name: 'Test Product',
        basePrice: 99.99,
      };

      const response = await request(app.getHttpServer())
        .patch(`/products/${mockProduct.id}`)
        .send(updateProductDto);

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61',
        name: 'Test Product',
        description: 'Test description',
        basePrice: 72.99,
        isActive: true,
        categoryId: '5a4979e1-0791-4bf0-88cd-2c47f0ae540a',
        category: {
          id: '5a4979e1-0791-4bf0-88cd-2c47f0ae540a',
          name: 'Category',
          description: 'Test category',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
        optionGroups: [],
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
    });
  });

  describe('DELETE /products/:productId', () => {
    it('should delete a product', async () => {
      jest
        .spyOn(ProductsService.prototype, 'remove')
        .mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete(`/products/${mockProduct.id}`)
        .expect(HttpStatus.OK);

      expect(productsService.remove).toHaveBeenCalledWith(mockProduct.id);
    });
  });
});
