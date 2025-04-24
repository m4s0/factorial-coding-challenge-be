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
    isActive: boolean = true,
  ): Promise<Product | null> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.optionGroups', 'optionGroups')
      .leftJoinAndSelect('optionGroups.options', 'options')
      .where('product.id = :productId', { productId })
      .andWhere('product.isActive = :isActive', {
        isActive: Boolean(isActive),
      });

    return queryBuilder.getOne();
  }

  async findAll(categoryName?: string): Promise<Product[]> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true })
      .orderBy('product.createdAt', 'DESC');

    if (categoryName) {
      queryBuilder.andWhere('category.name = :name', { name: categoryName });
    }

    return queryBuilder.getMany();
  }
}
