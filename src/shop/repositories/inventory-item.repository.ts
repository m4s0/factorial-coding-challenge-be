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
