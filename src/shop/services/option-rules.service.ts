import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ProductOptionRepository } from '@Shop/repositories/product-option.repository';
import { OptionRuleRepository } from '@Shop/repositories/option-rule.repository';
import { isRuleValid } from '@Shop/utils/is-rule-valid';
import { OptionRule } from '../entities/option-rule.entity';
import { RuleType } from '../entities/rule-type';

@Injectable()
export class OptionRulesService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly optionRuleRepository: OptionRuleRepository,
    private readonly productOptionRepository: ProductOptionRepository,
  ) {}

  async createRule(
    ifOptionId: string,
    thenOptionId: string,
    ruleType: RuleType,
  ): Promise<OptionRule> {
    const rule = this.entityManager.create(OptionRule, {
      ifOptionId,
      thenOptionId,
      ruleType,
    });

    return this.entityManager.save(rule);
  }

  async findRulesByProductId(productId: string): Promise<OptionRule[]> {
    const options =
      await this.productOptionRepository.findOptionsByProductId(productId);

    const optionIds = options.map((option) => option.id);

    return this.optionRuleRepository.findOptionRuleByOptionsIds(optionIds);
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

    const options =
      await this.productOptionRepository.findOptionsByIds(optionIds);

    const rules =
      await this.optionRuleRepository.findOptionRuleByOptionsIds(optionIds);

    for (const rule of rules) {
      if (!isRuleValid(rule, options)) {
        return false;
      }
    }

    return true;
  }
}
