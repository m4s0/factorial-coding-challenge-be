import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { OptionRulesService } from '@Shop/services/option-rules.service';
import { RuleType } from '@Shop/entities/rule-type';
import { OptionRule } from '@Shop/entities/option-rule.entity';
import { createTestApp } from '../../../test/create-test.app';

describe('OptionRulesController', () => {
  let app: INestApplication<App>;
  let optionRulesService: OptionRulesService;
  const mockOptionRule = {
    id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
    ruleType: RuleType.REQUIRES,
    ifOptionId: '4636127e-769e-4136-9a6a-8fddb7ca9692',
    ifOption: {
      id: '4636127e-769e-4136-9a6a-8fddb7ca9692',
      name: 'Size',
      displayName: 'Product Size',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    },
    thenOptionId: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
    thenOption: {
      id: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
      name: 'Color',
      displayName: 'Product Color',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  } as OptionRule;

  beforeEach(async () => {
    app = await createTestApp();

    optionRulesService = app.get<OptionRulesService>(OptionRulesService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /option-rules', () => {
    it('should return all OptionRules', async () => {
      jest
        .spyOn(OptionRulesService.prototype, 'getAll')
        .mockResolvedValue([mockOptionRule]);

      const response = await request(app.getHttpServer()).get('/option-rules');

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject([
        {
          id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
          ruleType: 'requires',
          ifOptionId: '4636127e-769e-4136-9a6a-8fddb7ca9692',
          ifOption: {
            id: '4636127e-769e-4136-9a6a-8fddb7ca9692',
            name: 'Size',
            displayName: 'Product Size',
            basePrice: null,
            isActive: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z',
          },
          thenOptionId: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
          thenOption: {
            id: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
            name: 'Color',
            displayName: 'Product Color',
            basePrice: null,
            isActive: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z',
          },
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
      ]);
    });

    it('should filter OptionRules by type', async () => {
      jest
        .spyOn(OptionRulesService.prototype, 'getAll')
        .mockResolvedValue([mockOptionRule]);

      const response = await request(app.getHttpServer()).get('/option-rules');

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject([
        {
          id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
          ruleType: 'requires',
          ifOptionId: '4636127e-769e-4136-9a6a-8fddb7ca9692',
          ifOption: {
            id: '4636127e-769e-4136-9a6a-8fddb7ca9692',
            name: 'Size',
            displayName: 'Product Size',
            basePrice: null,
            isActive: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z',
          },
          thenOptionId: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
          thenOption: {
            id: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
            name: 'Color',
            displayName: 'Product Color',
            basePrice: null,
            isActive: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z',
          },
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
      ]);
      expect(optionRulesService.getAll).toHaveBeenCalledWith();
    });
  });

  describe('GET /option-rules/:optionRuleId', () => {
    it('should return a single OptionRule', async () => {
      jest
        .spyOn(OptionRulesService.prototype, 'getById')
        .mockResolvedValue(mockOptionRule);

      const response = await request(app.getHttpServer()).get(
        `/option-rules/${mockOptionRule.id}`,
      );

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
        ruleType: 'requires',
        ifOptionId: '4636127e-769e-4136-9a6a-8fddb7ca9692',
        ifOption: {
          id: '4636127e-769e-4136-9a6a-8fddb7ca9692',
          name: 'Size',
          displayName: 'Product Size',
          basePrice: null,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
        thenOptionId: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
        thenOption: {
          id: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
          name: 'Color',
          displayName: 'Product Color',
          basePrice: null,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
    });
  });

  describe('POST /option-rules', () => {
    it('should create a new OptionRule', async () => {
      jest
        .spyOn(OptionRulesService.prototype, 'create')
        .mockResolvedValue(mockOptionRule);

      const createOptionRuleDto = {
        ifOptionId: '4636127e-769e-4136-9a6a-8fddb7ca9692',
        thenOptionId: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
        ruleType: RuleType.REQUIRES,
      };

      const response = await request(app.getHttpServer())
        .post('/option-rules')
        .send(createOptionRuleDto);

      expect(response.statusCode).toEqual(HttpStatus.CREATED);
      expect(response.body).toMatchObject({
        id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
        ruleType: 'requires',
        ifOptionId: '4636127e-769e-4136-9a6a-8fddb7ca9692',
        ifOption: {
          id: '4636127e-769e-4136-9a6a-8fddb7ca9692',
          name: 'Size',
          displayName: 'Product Size',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
        thenOptionId: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
        thenOption: {
          id: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
          name: 'Color',
          displayName: 'Product Color',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
    });

    it('should get an error if payload is not valid', async () => {
      const invalidPayload = {};

      const response = await request(app.getHttpServer())
        .post('/option-rules')
        .send(invalidPayload);

      expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
      expect(response.body).toMatchObject({
        message: 'Validation failed',
        errors: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['ifOptionId'],
            message: 'Required',
          },
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['thenOptionId'],
            message: 'Required',
          },
          {
            expected: "'requires' | 'excludes' | 'only_allows'",
            received: 'undefined',
            code: 'invalid_type',
            path: ['ruleType'],
            message: 'Required',
          },
        ],
      });
    });
  });

  describe('PUT /option-rules/:optionRuleId', () => {
    it('should update an existing OptionRule', async () => {
      jest
        .spyOn(OptionRulesService.prototype, 'update')
        .mockResolvedValue(mockOptionRule);

      const updateProductDto = {
        name: 'Test Product',
        basePrice: 99.99,
      };

      const response = await request(app.getHttpServer())
        .patch(`/option-rules/${mockOptionRule.id}`)
        .send(updateProductDto);

      expect(response.statusCode).toEqual(HttpStatus.OK);
      expect(response.body).toMatchObject({
        id: '755cf8ae-950c-4be2-9a20-1fb6576b745e',
        ruleType: 'requires',
        ifOptionId: '4636127e-769e-4136-9a6a-8fddb7ca9692',
        ifOption: {
          id: '4636127e-769e-4136-9a6a-8fddb7ca9692',
          name: 'Size',
          displayName: 'Product Size',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
        thenOptionId: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
        thenOption: {
          id: 'fb5d0e88-8014-4883-82d5-94d0af8e723f',
          name: 'Color',
          displayName: 'Product Color',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-02T00:00:00.000Z',
        },
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
      });
    });
  });

  describe('DELETE /option-rules/:optionRuleId', () => {
    it('should delete a OptionRule', async () => {
      jest
        .spyOn(OptionRulesService.prototype, 'remove')
        .mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete(`/option-rules/${mockOptionRule.id}`)
        .expect(HttpStatus.OK);

      expect(optionRulesService.remove).toHaveBeenCalledWith(mockOptionRule.id);
    });
  });
});
