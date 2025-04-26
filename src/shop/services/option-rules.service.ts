import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ProductOptionRepository } from '@Shop/repositories/product-option.repository';
import { OptionRuleRepository } from '@Shop/repositories/option-rule.repository';
import { isRuleValid } from '@Shop/utils/is-rule-valid';
import { CreateOptionRuleInput } from '@Shop/types/create-option-rule.input';
import { UpdateOptionRuleInput } from '@Shop/types/update-option-rule.input';
import { OptionRule } from '../entities/option-rule.entity';

@Injectable()
export class OptionRulesService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly optionRuleRepository: OptionRuleRepository,
    private readonly productOptionRepository: ProductOptionRepository,
  ) {}

  async getAll(): Promise<OptionRule[]> {
    return this.optionRuleRepository.findAll();
  }

  async getById(id: string): Promise<OptionRule> {
    const optionsRule = await this.optionRuleRepository.findOneById(id);

    if (!optionsRule) {
      throw new NotFoundException(`OptionRule with ID ${id} not found`);
    }

    return optionsRule;
  }

  async getRulesByProductId(productId: string): Promise<OptionRule[]> {
    const optionRules =
      await this.productOptionRepository.findAllByProductId(productId);

    const optionIds = optionRules.map((option) => option.id);

    return this.optionRuleRepository.findOptionRuleByOptionsIds(optionIds);
  }

  async create(input: CreateOptionRuleInput): Promise<OptionRule> {
    const optionRule = this.entityManager.create(OptionRule, input);

    return this.entityManager.save(optionRule);
  }

  async update(id: string, input: UpdateOptionRuleInput): Promise<OptionRule> {
    const existingOptionRule = await this.getById(id);

    this.entityManager.merge(OptionRule, existingOptionRule, input);
    return this.entityManager.save(existingOptionRule);
  }

  async remove(id: string) {
    const existingOptionRule = await this.getById(id);

    await this.entityManager.remove(existingOptionRule);
  }

  async validateConfiguration(
    productId: string,
    optionIds: string[],
  ): Promise<boolean> {
    if (!productId || optionIds.length === 0) {
      throw new BadRequestException(
        'Product ID and at least one option ID are required',
      );
    }

    const options = await this.productOptionRepository.findAllByIds(optionIds);

    const optionRules =
      await this.optionRuleRepository.findOptionRuleByOptionsIds(optionIds);

    for (const optionRule of optionRules) {
      if (!isRuleValid(optionRule, options)) {
        return false;
      }
    }

    return true;
  }
}
