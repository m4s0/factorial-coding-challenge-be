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

  async findAll(): Promise<ProductCategory[]> {
    return this.productCategoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOneById(categoryId: string): Promise<ProductCategory | null> {
    return this.productCategoryRepository.findOne({
      where: { id: categoryId },
    });
  }
}
