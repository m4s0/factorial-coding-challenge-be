import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { ProductsService } from '@Shop/services/products.service';
import { ProductOutput } from '@Shop/types/product.output';
import { ProductOptionGroupOutput } from '@Shop/types/product-option-group.output';
import { OptionRuleOutput } from '@Shop/types/option-rule.output';
import { ProductCategory } from '@Shop/entities/product-category.entity';
import { Product } from '@Shop/entities/product.entity';
import { createUUID } from '@Common/utils/create-uuid';
import { OptionRulesService } from '@Shop/services/option-rules.service';
import { createTestApp } from '../../../test/create-test.app';

describe('ProductController', () => {
  let app: INestApplication<App>;
  let productsService: ProductsService;
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
      expect(response.body).toEqual([
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

    it('should filter products by type', async () => {
      jest
        .spyOn(ProductsService.prototype, 'getAll')
        .mockResolvedValue([mockProduct]);

      const response = await request(app.getHttpServer()).get(
        '/products?categoryName=bicycle',
      );

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toEqual([
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
      expect(productsService.getAll).toHaveBeenCalledWith('bicycle');
    });
  });

  describe('GET /products/:productId', () => {
    it('should return a single product', async () => {
      jest
        .spyOn(ProductsService.prototype, 'getById')
        .mockResolvedValue(mockProduct);

      const response = await request(app.getHttpServer()).get(
        `/products/${mockProduct.id}`,
      );

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toEqual({
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

  describe('GET /products/:productId/configure', () => {
    it('should return product configuration', async () => {
      const mockConfig = {
        product: {} as ProductOutput,
        optionGroups: [] as ProductOptionGroupOutput[],
        rules: [] as OptionRuleOutput[],
      };

      jest
        .spyOn(productsService, 'getProductConfiguration')
        .mockResolvedValue(mockConfig);

      const response = await request(app.getHttpServer())
        .get(`/products/${mockProduct.id}/configure`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(mockConfig);
    });
  });

  describe('GET /products/:productId/validate', () => {
    it('should validate product configuration', async () => {
      const productId = 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61';
      const productOptionIds = [
        'bb88c5fd-e2fb-4d9a-9dd0-4a0f69228c62',
        '5dd40b65-034e-4ca8-b991-af3804cb08c8',
      ];

      jest
        .spyOn(optionRulesService, 'validateConfiguration')
        .mockResolvedValue(true);

      const response = await request(app.getHttpServer())
        .get(`/products/${productId}/validate`)
        .query({
          productId,
          optionIds: productOptionIds,
        });

      expect(response.status).toBe(HttpStatus.OK);
      // expect(response.body).toBe({
      //   isValid: true,
      // });
      expect(optionRulesService.validateConfiguration).toHaveBeenCalledWith(
        productId,
        productOptionIds,
      );
    });

    it('should return 400 for invalid query parameters', async () => {
      const response = await request(app.getHttpServer())
        .get(`/products/${createUUID()}/validate`)
        .query({ optionIds: [] });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /products/:productId/price', () => {
    it('should calculate price for valid configuration', async () => {
      const productId = 'ea88c5fd-e2fb-4d9a-9dd0-4a0f69228c61';
      const productOptionIds = ['bb88c5fd-e2fb-4d9a-9dd0-4a0f69228c62'];

      const expectedPrice = 199.99;

      jest
        .spyOn(productsService, 'calculateProductPrice')
        .mockResolvedValue(expectedPrice);

      const response = await request(app.getHttpServer())
        .get(`/products/${productId}/price`)
        .query({ optionIds: productOptionIds });

      expect(response.status).toBe(HttpStatus.OK);
      // expect(response.body).toBe({
      //   price: 199.99,
      // });
      expect(productsService.calculateProductPrice).toHaveBeenCalledWith(
        productId,
        productOptionIds,
      );
    });

    it('should return 400 for invalid query parameters', async () => {
      const response = await request(app.getHttpServer())
        .get(`/products/${createUUID()}/price`)
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
      expect(response.body).toEqual({
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
      expect(response.body).toEqual({
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
      expect(response.body).toEqual({
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
