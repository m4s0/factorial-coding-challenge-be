import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateProductOptionInput } from '@Shop/types/create-product-option.input';
import { UpdateProductOptionInput } from '@Shop/types/update-product-option.input';
import { ProductOptionRepository } from '@Shop/repositories/product-option.repository';
import { ProductOption } from '../entities/product-option.entity';

@Injectable()
export class ProductOptionsService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly productOptionRepository: ProductOptionRepository,
  ) {}

  async getById(id: string): Promise<ProductOption> {
    const productOption = await this.productOptionRepository.findOneById(id);
    if (!productOption) {
      throw new NotFoundException(`ProductOption with ID ${id} not found`);
    }

    return productOption;
  }

  async getAll(): Promise<ProductOption[]> {
    return this.productOptionRepository.findAll();
  }

  async findOptionsByGroupId(groupId: string): Promise<ProductOption[]> {
    return this.productOptionRepository.findOptionsByGroupId(groupId);
  }

  async create(input: CreateProductOptionInput): Promise<ProductOption> {
    const productOption = this.entityManager.create(ProductOption, input);

    return this.entityManager.save(productOption);
  }

  async update(
    id: string,
    input: UpdateProductOptionInput,
  ): Promise<ProductOption> {
    const productOption = await this.getById(id);

    this.entityManager.merge(ProductOption, productOption, input);

    return this.entityManager.save(productOption);
  }

  async remove(id: string): Promise<void> {
    const productOption = await this.getById(id);

    await this.entityManager.remove(productOption);
  }
}
