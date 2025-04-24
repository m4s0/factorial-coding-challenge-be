import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductOptionGroup } from '@Shop/entities/product-option-group.entity';

@Injectable()
export class ProductOptionGroupRepository {
  constructor(
    @InjectRepository(ProductOptionGroup)
    private productOptionGroupRepository: Repository<ProductOptionGroup>,
  ) {}

  async findAll(isActive?: boolean): Promise<ProductOptionGroup[]> {
    const queryBuilder = this.productOptionGroupRepository
      .createQueryBuilder('optionGroup')
      .innerJoinAndSelect('optionGroup.product', 'product')
      .orderBy('optionGroup.createdAt', 'DESC');

    if (isActive !== undefined) {
      queryBuilder.where('optionGroup.isActive = :isActive', {
        isActive: Boolean(isActive),
      });
    }

    return queryBuilder.getMany();
  }

  async findOneById(id: string): Promise<ProductOptionGroup | null> {
    return this.productOptionGroupRepository.findOne({
      where: { id },
      relations: ['product'],
    });
  }

  async findOptionGroupsByProductId(
    productId: string,
  ): Promise<ProductOptionGroup[]> {
    return this.productOptionGroupRepository.find({
      where: { productId },
      relations: ['options', 'product'],
      order: {
        name: 'DESC',
        options: {
          name: 'DESC',
        },
      },
    });
  }
}
