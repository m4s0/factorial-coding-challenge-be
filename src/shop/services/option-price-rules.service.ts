import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { OptionPriceRuleRepository } from '@Shop/repositories/option-price-rule.repository';
import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';
import { CreateOptionPriceRuleInput } from '@Shop/types/create-option-price-rule.input';
import { UpdateOptionPriceRuleInput } from '@Shop/types/update-option-price-rule.input';

@Injectable()
export class OptionPriceRulesService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly optionPriceRuleRepository: OptionPriceRuleRepository,
  ) {}

  async getAll(): Promise<OptionPriceRule[]> {
    return this.optionPriceRuleRepository.findAll();
  }

  async getById(id: string): Promise<OptionPriceRule> {
    const optionPriceRules =
      await this.optionPriceRuleRepository.findOneById(id);

    if (!optionPriceRules) {
      throw new NotFoundException(`OptionPriceRule with ID ${id} not found`);
    }

    return optionPriceRules;
  }

  async create(input: CreateOptionPriceRuleInput): Promise<OptionPriceRule> {
    const optionPriceRule = this.entityManager.create(OptionPriceRule, input);

    return this.entityManager.save(optionPriceRule);
  }

  async update(
    id: string,
    input: UpdateOptionPriceRuleInput,
  ): Promise<OptionPriceRule> {
    const existingOptionPriceRule = await this.getById(id);

    this.entityManager.merge(OptionPriceRule, existingOptionPriceRule, input);
    return this.entityManager.save(existingOptionPriceRule);
  }

  async remove(id: string) {
    const existingOptionPriceRule = await this.getById(id);

    await this.entityManager.remove(existingOptionPriceRule);
  }
}
