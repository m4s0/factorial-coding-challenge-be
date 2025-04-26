import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { InventoryItem } from '@Shop/entities/inventory-item.entity';

@Injectable()
export class InventoryItemRepository {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryItemRepository: Repository<InventoryItem>,
  ) {}

  async findAll(): Promise<InventoryItem[]> {
    return this.inventoryItemRepository.find({
      relations: ['productOption'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneById(id: string) {
    return this.inventoryItemRepository.findOne({
      where: { id },
      relations: ['productOption'],
    });
  }

  // async findOneByProductId(productId: string): Promise<InventoryItem | null> {
  //   return this.inventoryItemRepository
  //     .createQueryBuilder('inventoryItem')
  //     .leftJoinAndSelect('inventoryItem.productOption', 'productOption')
  //     .leftJoinAndSelect('productOption.optionGroup', 'productOptionGroup')
  //     .where('productOptionGroup.productId = :productId', { productId })
  //     .getOne();
  // }

  async findOneByProductId(productId: string): Promise<InventoryItem | null> {
    return this.inventoryItemRepository
      .createQueryBuilder('inventoryItem')
      .leftJoinAndSelect('inventoryItem.productOption', 'productOption')
      .leftJoinAndSelect('productOption.optionGroup', 'productOptionGroup')
      .leftJoinAndSelect('productOptionGroup.product', 'product')
      .where('product.id = :productId', { productId })
      .getOne();
  }

  async findByOptionIds(optionIds: string[]): Promise<InventoryItem[]> {
    return this.inventoryItemRepository.find({
      where: { productOptionId: In(optionIds) },
    });
  }

  async findOneByProductOptionId(
    productOptionId: string,
  ): Promise<InventoryItem | null> {
    return this.inventoryItemRepository.findOne({
      where: { productOptionId },
    });
  }
}
