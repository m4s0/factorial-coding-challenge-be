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

  async findAll(isActive?: boolean): Promise<OptionPriceRule[]> {
    const queryBuilder = this.optionPriceRuleRepository
      .createQueryBuilder('optionPriceRule')
      .leftJoinAndSelect('optionPriceRule.dependentOption', 'dependentOption')
      .leftJoinAndSelect('optionPriceRule.targetOption', 'targetOption')
      .orderBy('optionPriceRule.createdAt', 'DESC');

    if (isActive !== undefined) {
      queryBuilder.where('optionPriceRule.isActive = :isActive', {
        isActive: Boolean(isActive),
      });
    }

    return queryBuilder.getMany();
  }

  async findOneById(
    id: string,
    isActive?: boolean,
  ): Promise<OptionPriceRule | null> {
    const queryBuilder = this.optionPriceRuleRepository
      .createQueryBuilder('optionPriceRule')
      .leftJoinAndSelect('optionPriceRule.dependentOption', 'dependentOption')
      .leftJoinAndSelect('optionPriceRule.targetOption', 'targetOption')
      .where('optionPriceRule.id = :optionPriceRuleId', {
        optionPriceRuleId: id,
      });

    if (isActive !== undefined) {
      queryBuilder.andWhere('optionPriceRule.isActive = :isActive', {
        isActive: Boolean(isActive),
      });
    }

    return queryBuilder.getOne();
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
}
