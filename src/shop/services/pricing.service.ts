import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { OptionPriceRuleRepository } from '@Shop/repositories/option-price-rule.repository';
import { ProductOptionRepository } from '@Shop/repositories/product-option.repository';
import { LogicException } from '@Common/exceptions/logic-exception';
import { getApplicableRule } from '@Shop/utils/get-applicable-rule';
import { OptionPriceRule } from '../entities/option-price-rule.entity';

@Injectable()
export class PricingService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly optionPriceRuleRepository: OptionPriceRuleRepository,
    private readonly productOptionRepository: ProductOptionRepository,
  ) {}

  async calculateOptionsPrice(selectedOptionIds: string[]): Promise<number> {
    let totalPrice = 0;

    const selectedProductOptions =
      await this.productOptionRepository.findAllByIds(selectedOptionIds, true);

    if (selectedProductOptions.length === 0) {
      return totalPrice;
    }

    const applicableRules =
      await this.optionPriceRuleRepository.findApplicableRules(
        selectedOptionIds,
      );

    for (const option of selectedProductOptions) {
      const applicableRule = getApplicableRule(
        applicableRules,
        option,
        selectedProductOptions,
      );

      if (applicableRule) {
        totalPrice += Number(applicableRule.price);
      } else {
        totalPrice += Number(option.basePrice);
      }
    }

    return Number(totalPrice.toFixed(2));
  }

  async createPriceRule(
    targetOptionId: string,
    dependentOptionId: string,
    price: number,
  ): Promise<OptionPriceRule> {
    const targetOption =
      await this.productOptionRepository.findOneById(targetOptionId);

    if (!targetOption) {
      throw new NotFoundException(`Target option ${targetOptionId} not found`);
    }

    if (targetOptionId === dependentOptionId) {
      throw new LogicException(
        'Cannot create a price rule with the same option as target and dependent',
      );
    }

    const dependentOption =
      await this.productOptionRepository.findOneById(dependentOptionId);

    if (!dependentOption) {
      throw new NotFoundException(
        `Dependent option ${dependentOptionId} not found`,
      );
    }

    const existingRule =
      await this.optionPriceRuleRepository.findOneByTargetOptionAndDependentOption(
        targetOptionId,
        dependentOptionId,
      );

    if (existingRule) {
      throw new LogicException('A price rule already exists for these options');
    }

    const rule = this.entityManager.create(OptionPriceRule, {
      targetOptionId: targetOption.id,
      dependentOptionId: dependentOption.id,
      price,
    });

    return this.entityManager.save(rule);
  }
}
