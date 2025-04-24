import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OptionPriceRule } from '@Shop/entities/option-price-rule.entity';

@Injectable()
export class OptionPriceRuleRepository {
  constructor(
    @InjectRepository(OptionPriceRule)
    private optionPriceRuleRepository: Repository<OptionPriceRule>,
  ) {}

  async findApplicableRules(
    selectedOptionIds: string[],
  ): Promise<OptionPriceRule[]> {
    return this.optionPriceRuleRepository
      .createQueryBuilder('rule')
      .where('rule.targetOptionId IN (:...selectedOptionIds)', {
        selectedOptionIds,
      })
      .andWhere('rule.dependentOptionId IN (:...selectedOptionIds)', {
        selectedOptionIds,
      })
      .andWhere('rule.isActive = true')
      .getMany();
  }

  async findOneByTargetOptionAndDependentOption(
    targetOptionId: string,
    dependentOptionId: string,
  ): Promise<OptionPriceRule | null> {
    return this.optionPriceRuleRepository.findOne({
      where: {
        targetOptionId,
        dependentOptionId,
        isActive: true,
      },
    });
  }
}
