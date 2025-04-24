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
    isActive?: boolean,
  ): Promise<ProductOption | null> {
    const where: { id: string; isActive?: boolean } = { id: optionId };

    if (typeof isActive !== 'undefined') {
      where.isActive = Boolean(isActive);
    }

    return this.productOptionRepository.findOneBy(where);
  }

  async findAll(isActive?: boolean): Promise<ProductOption[]> {
    const queryBuilder = this.productOptionRepository
      .createQueryBuilder('option')
      .innerJoinAndSelect('option.optionGroup', 'group')
      .orderBy('option.createdAt', 'DESC')
      .orderBy('group.createdAt', 'DESC');

    if (isActive !== undefined) {
      queryBuilder.where('option.isActive = :isActive', {
        isActive: Boolean(isActive),
      });
    }

    return queryBuilder.getMany();
  }

  async findOptionsByIds(
    optionIds: string[],
    isActive?: boolean,
  ): Promise<ProductOption[]> {
    if (!optionIds.length) {
      return [];
    }

    const queryBuilder = this.productOptionRepository
      .createQueryBuilder('option')
      .innerJoinAndSelect('option.optionGroup', 'group')
      .where('option.id IN (:...optionIds)', { optionIds })
      .orderBy('option.createdAt', 'DESC');

    if (isActive !== undefined) {
      queryBuilder.andWhere('option.isActive = :isActive', {
        isActive: Boolean(isActive),
      });
    }

    return queryBuilder.getMany();
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
