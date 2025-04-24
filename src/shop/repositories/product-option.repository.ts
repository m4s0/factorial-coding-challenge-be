import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductOption } from '@Shop/entities/product-option.entity';

@Injectable()
export class ProductOptionRepository {
  constructor(
    @InjectRepository(ProductOption)
    private productOptionRepository: Repository<ProductOption>,
  ) {}

  async findOneById(
    optionId: string,
    isActive: boolean = true,
  ): Promise<ProductOption | null> {
    return this.productOptionRepository.findOneBy({
      id: optionId,
      isActive: Boolean(isActive),
    });
  }

  async findAll(isActive: boolean = true): Promise<ProductOption[]> {
    return this.productOptionRepository
      .createQueryBuilder('option')
      .innerJoinAndSelect('option.optionGroup', 'group')
      .where('option.isActive = :isActive', { isActive: Boolean(isActive) })
      .orderBy('option.createdAt', 'DESC')
      .orderBy('group.createdAt', 'DESC')
      .getMany();
  }

  async findOptionsByIds(
    optionIds: string[],
    isActive: boolean = true,
  ): Promise<ProductOption[]> {
    if (!optionIds.length) {
      return [];
    }

    return this.productOptionRepository
      .createQueryBuilder('option')
      .innerJoinAndSelect('option.optionGroup', 'group')
      .where('option.id IN (:...optionIds)', { optionIds })
      .andWhere('option.isActive = :isActive', { isActive: Boolean(isActive) })
      .orderBy('option.createdAt', 'DESC')
      .getMany();
  }

  async findOptionsByProductId(productId: string): Promise<ProductOption[]> {
    return this.productOptionRepository
      .createQueryBuilder('option')
      .innerJoin('option.optionGroup', 'group')
      .innerJoin('group.product', 'product')
      .where('product.id = :productId', { productId })
      .getMany();
  }

  async findOptionsByGroupId(groupId: string): Promise<ProductOption[]> {
    return this.productOptionRepository.find({
      where: { optionGroupId: groupId, isActive: true },
      order: { name: 'DESC' },
    });
  }
}
