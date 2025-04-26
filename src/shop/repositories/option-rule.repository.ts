import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OptionRule } from '@Shop/entities/option-rule.entity';

@Injectable()
export class OptionRuleRepository {
  constructor(
    @InjectRepository(OptionRule)
    private optionRuleRepository: Repository<OptionRule>,
  ) {}

  async findAll(): Promise<OptionRule[]> {
    return this.optionRuleRepository.find({
      relations: ['ifOption', 'thenOption'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneById(id: string): Promise<OptionRule | null> {
    return this.optionRuleRepository.findOne({
      where: { id },
      relations: ['ifOption', 'thenOption'],
    });
  }

  async findOptionRuleByOptionsIds(optionIds: string[]): Promise<OptionRule[]> {
    return this.optionRuleRepository
      .createQueryBuilder('rule')
      .leftJoinAndSelect('rule.ifOption', 'ifOption')
      .leftJoinAndSelect('rule.thenOption', 'thenOption')
      .leftJoinAndSelect('ifOption.optionGroup', 'ifOptionGroup')
      .leftJoinAndSelect('thenOption.optionGroup', 'thenOptionGroup')
      .where(
        'rule.ifOptionId IN (:...optionIds) OR rule.thenOptionId IN (:...optionIds)',
        { optionIds },
      )
      .andWhere('rule.isActive = :isActive', { isActive: true })
      .getMany();
  }
}
