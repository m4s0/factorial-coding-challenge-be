import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@Shop/entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findById(
    productId: string,
    isActive?: boolean,
  ): Promise<Product | null> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.optionGroups', 'optionGroups')
      .leftJoinAndSelect('optionGroups.options', 'options')
      .where('product.id = :productId', { productId });

    if (isActive !== undefined) {
      queryBuilder.andWhere('product.isActive = :isActive', {
        isActive: Boolean(isActive),
      });
    }

    return queryBuilder.getOne();
  }

  async findAll(categoryName?: string, isActive?: boolean): Promise<Product[]> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('product.createdAt', 'DESC');

    if (isActive !== undefined) {
      queryBuilder.where('product.isActive = :isActive', {
        isActive: Boolean(isActive),
      });
    }

    if (categoryName) {
      const whereClause = isActive !== undefined ? 'andWhere' : 'where';
      queryBuilder[whereClause]('category.name = :name', {
        name: categoryName,
      });
    }

    return queryBuilder.getMany();
  }
}
