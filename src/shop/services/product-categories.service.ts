import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ProductCategory } from '@Shop/entities/product-category.entity';
import { ProductCategoryRepository } from '@Shop/repositories/product-category.repository';
import { CreateProductCategoryInput } from '@Shop/types/create-product-category.input';
import { UpdateProductCategoryInput } from '@Shop/types/update-product-category.input';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly productCategoryRepository: ProductCategoryRepository,
  ) {}

  async getAll(): Promise<ProductCategory[]> {
    return this.productCategoryRepository.findAll();
  }

  async getById(id: string): Promise<ProductCategory> {
    const category = await this.productCategoryRepository.findOneById(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async create(input: CreateProductCategoryInput): Promise<ProductCategory> {
    const category = this.entityManager.create(ProductCategory, {
      name: input.name,
      description: input.description,
      isActive: input.isActive,
    });

    return this.entityManager.save(category);
  }

  async update(
    id: string,
    input: UpdateProductCategoryInput,
  ): Promise<ProductCategory> {
    const existingCategory = await this.getById(id);

    this.entityManager.merge(ProductCategory, existingCategory, input);
    return this.entityManager.save(existingCategory);
  }

  async remove(id: string): Promise<void> {
    const existingCategory = await this.getById(id);

    await this.entityManager.remove(existingCategory);
  }
}
