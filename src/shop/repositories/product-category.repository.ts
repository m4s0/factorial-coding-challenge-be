import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '@Shop/entities/product-category.entity';

@Injectable()
export class ProductCategoryRepository {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async findAll(isActive?: boolean): Promise<ProductCategory[]> {
    const queryBuilder = this.productCategoryRepository
      .createQueryBuilder('category')
      .orderBy('category.createdAt', 'DESC');

    if (isActive !== undefined) {
      queryBuilder.where('category.isActive = :isActive', {
        isActive: Boolean(isActive),
      });
    }

    return queryBuilder.getMany();
  }

  async findOneById(categoryId: string): Promise<ProductCategory | null> {
    return this.productCategoryRepository.findOne({
      where: { id: categoryId },
    });
  }
}
