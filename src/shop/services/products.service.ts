import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { transformProductConfiguration } from '@Shop/services/transfomers/product-configuration.transformer';
import { ProductConfigurationOutput } from '@Shop/types/product-configuration.output';
import { UpdateProductInput } from '@Shop/types/update-product.input';
import { ProductRepository } from '@Shop/repositories/product.repository';
import { ProductCategoryRepository } from '@Shop/repositories/product-category.repository';
import { ProductOptionRepository } from '@Shop/repositories/product-option.repository';
import { getApplicableRule } from '@Shop/utils/get-applicable-rule';
import { OptionPriceRuleRepository } from '@Shop/repositories/option-price-rule.repository';
import { ProductOptionGroupsService } from '@Shop/services/product-option-groups.service';
import { Product } from '../entities/product.entity';
import { OptionRulesService } from './option-rules.service';
import { PricingService } from './pricing.service';
import { CreateProductInput } from '../types/create-product.input';

@Injectable()
export class ProductsService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly productRepository: ProductRepository,
    private readonly productCategoryRepository: ProductCategoryRepository,
    private readonly productOptionRepository: ProductOptionRepository,
    private readonly optionPriceRuleRepository: OptionPriceRuleRepository,
    private readonly productOptionGroupsService: ProductOptionGroupsService,
    private readonly optionRulesService: OptionRulesService,
    private readonly pricingService: PricingService,
  ) {}

  async getAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async getByIdAndOptions(id: string, optionIds: string[]): Promise<Product> {
    const product = await this.getById(id);

    const selectedProductOptions =
      await this.productOptionRepository.findAllByIds(optionIds);

    if (selectedProductOptions.length === 0) {
      return product;
    }

    const applicableRules =
      await this.optionPriceRuleRepository.findApplicableRules(optionIds);

    for (const option of selectedProductOptions) {
      option.basePrice = Number(option.basePrice);

      const applicableRule = getApplicableRule(
        applicableRules,
        option,
        selectedProductOptions,
      );

      if (applicableRule) {
        const optionToUpdate = product.optionGroups
          .flatMap((group) => group.options)
          .find((o) => o.id === option.id);

        if (optionToUpdate) {
          optionToUpdate.basePrice = Number(applicableRule.price);
        }
      }
    }

    return product;
  }

  async getProductConfiguration(
    id: string,
  ): Promise<ProductConfigurationOutput> {
    const existingProduct = await this.getById(id);

    const optionGroups =
      await this.productOptionGroupsService.findOptionGroupsByProductId(id);

    const rules = await this.optionRulesService.getRulesByProductId(id);

    return transformProductConfiguration(existingProduct, optionGroups, rules);
  }

  async create(input: CreateProductInput): Promise<Product> {
    const category = await this.productCategoryRepository.findOneById(
      input.categoryId,
    );

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${input.categoryId} not found`,
      );
    }

    const product = this.entityManager.create(Product, input);
    await this.entityManager.save(product);

    return product;
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    const existingProduct = await this.getById(id);

    this.entityManager.merge(Product, existingProduct, input);
    return this.entityManager.save(existingProduct);
  }

  async remove(id: string): Promise<void> {
    const existingProduct = await this.getById(id);

    await this.entityManager.remove(existingProduct);
  }

  async calculateProductPrice(
    productId: string,
    optionIds: string[],
  ): Promise<number> {
    if (!productId || optionIds.length === 0) {
      throw new BadRequestException(
        'Product ID and at least one option ID are required',
      );
    }

    const product = await this.getById(productId);

    const optionsPrice =
      await this.pricingService.calculateOptionsPrice(optionIds);

    return Number((Number(product.basePrice) + optionsPrice).toFixed(2));
  }
}
