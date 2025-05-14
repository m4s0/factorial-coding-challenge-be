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
    const queryBuilder = this.productOptionRepository
      .createQueryBuilder('option')
      .innerJoinAndSelect('option.optionGroup', 'group')
      .leftJoinAndSelect('option.inventoryItem', 'inventoryItem')
      .where('option.id = :optionId', { optionId });

    if (typeof isActive !== 'undefined') {
      queryBuilder.andWhere('option.isActive = :isActive', {
        isActive: Boolean(isActive),
      });
    }

    return queryBuilder.getOne();
  }

  async findAll(isActive?: boolean): Promise<ProductOption[]> {
    const queryBuilder = this.productOptionRepository
      .createQueryBuilder('option')
      .innerJoinAndSelect('option.optionGroup', 'group')
      .leftJoinAndSelect('option.inventoryItem', 'inventoryItem')
      .orderBy('option.createdAt', 'DESC');

    if (isActive !== undefined) {
      queryBuilder.where('option.isActive = :isActive', {
        isActive: Boolean(isActive),
      });
    }

    return queryBuilder.getMany();
  }

  async findAllByIds(
    optionIds: string[],
    isActive?: boolean,
  ): Promise<ProductOption[]> {
    if (!optionIds.length) {
      return [];
    }

    const queryBuilder = this.productOptionRepository
      .createQueryBuilder('option')
      .innerJoinAndSelect('option.optionGroup', 'group')
      .leftJoinAndSelect('option.inventoryItem', 'inventoryItem')
      .where('option.id IN (:...optionIds)', { optionIds })
      .orderBy('option.createdAt', 'DESC');

    if (isActive !== undefined) {
      queryBuilder.andWhere('option.isActive = :isActive', {
        isActive: Boolean(isActive),
      });
    }

    return queryBuilder.getMany();
  }

  async findAllByProductId(productId: string): Promise<ProductOption[]> {
    return this.productOptionRepository
      .createQueryBuilder('option')
      .innerJoinAndSelect('option.optionGroup', 'group')
      .innerJoinAndSelect('group.product', 'product')
      .where('product.id = :productId', { productId })
      .getMany();
  }

  async findAllByGroupId(groupId: string): Promise<ProductOption[]> {
    return this.productOptionRepository
      .createQueryBuilder('option')
      .leftJoinAndSelect('option.inventoryItem', 'inventoryItem')
      .where('option.optionGroupId = :groupId', { groupId })
      .andWhere('option.isActive = :isActive', { isActive: true })
      .orderBy('option.name', 'DESC')
      .getMany();
  }
}
