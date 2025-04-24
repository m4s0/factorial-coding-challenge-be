import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateProductOptionGroupInput } from '@Shop/types/create-product-option-group.input';
import { ProductOptionGroupRepository } from '@Shop/repositories/product-option-group.repository';
import { UpdateProductOptionGroupInput } from '@Shop/types/update-product-option-group.input';
import { ProductOptionGroup } from '../entities/product-option-group.entity';

@Injectable()
export class ProductOptionGroupsService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly productOptionGroupRepository: ProductOptionGroupRepository,
  ) {}

  async getById(id: string): Promise<ProductOptionGroup> {
    const productOptionGroup =
      await this.productOptionGroupRepository.findOneById(id);
    if (!productOptionGroup) {
      throw new NotFoundException(`ProductOptionGroup with ID ${id} not found`);
    }

    return productOptionGroup;
  }

  async getAll(): Promise<ProductOptionGroup[]> {
    return this.productOptionGroupRepository.findAll();
  }

  async findOptionGroupsByProductId(
    productId: string,
  ): Promise<ProductOptionGroup[]> {
    return this.productOptionGroupRepository.findOptionGroupsByProductId(
      productId,
    );
  }

  async create(
    input: CreateProductOptionGroupInput,
  ): Promise<ProductOptionGroup> {
    const productOptionGroup = this.entityManager.create(
      ProductOptionGroup,
      input,
    );
    return this.entityManager.save(productOptionGroup);
  }

  async update(
    id: string,
    input: UpdateProductOptionGroupInput,
  ): Promise<ProductOptionGroup> {
    const productOptionGroup = await this.getById(id);

    this.entityManager.merge(ProductOptionGroup, productOptionGroup, input);
    return this.entityManager.save(productOptionGroup);
  }

  async remove(id: string): Promise<void> {
    const productOptionGroup =
      await this.productOptionGroupRepository.findOneById(id);
    if (!productOptionGroup) {
      throw new NotFoundException(`ProductOptionGroup with ID ${id} not found`);
    }

    await this.entityManager.remove(productOptionGroup);
  }
}
