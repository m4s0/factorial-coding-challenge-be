import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { InventoryStatusForProduct } from '@Shop/types/inventory-status-for-product';
import { UpdateInventoryInput } from '@Shop/types/update-inventory.input';
import { InventoryItemRepository } from '@Shop/repositories/inventory-item.repository';
import { ProductOptionGroupsService } from '@Shop/services/product-option-groups.service';
import { InventoryItem } from '../entities/inventory-item.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly inventoryRepository: InventoryItemRepository,
    private readonly productOptionGroupsService: ProductOptionGroupsService,
  ) {}

  async getInventoryStatusForProduct(
    productId: string,
  ): Promise<InventoryStatusForProduct[]> {
    const optionGroups =
      await this.productOptionGroupsService.findOptionGroupsByProductId(
        productId,
      );
    const optionIds = optionGroups
      .flatMap((group) => group.options)
      .map((option) => option.id);

    const inventoryItems =
      await this.inventoryRepository.findByOptionIds(optionIds);

    return optionIds.map((optionId) => {
      const inventoryItem = inventoryItems.find(
        (item) => item.productOptionId === optionId,
      );

      return {
        productOptionId: optionId,
        quantity: inventoryItem?.quantity || 0,
        inStock: !inventoryItem?.outOfStock,
      };
    });
  }

  async updateInventory(
    productOptionId: string,
    input: UpdateInventoryInput,
  ): Promise<InventoryItem> {
    let inventoryItem =
      await this.inventoryRepository.findOneByProductOptionId(productOptionId);

    if (!inventoryItem) {
      inventoryItem = this.entityManager.create(InventoryItem, {
        productOptionId,
        quantity: input.quantity,
        outOfStock: input.quantity <= 0,
      });
    } else {
      inventoryItem.quantity = input.quantity;
      inventoryItem.outOfStock =
        input.outOfStock !== undefined ? input.outOfStock : input.quantity <= 0;
    }

    return this.entityManager.save(inventoryItem);
  }

  async checkInventoryAvailability(
    productOptionIds: string[],
  ): Promise<boolean> {
    const inventoryItems =
      await this.inventoryRepository.findByOptionIds(productOptionIds);

    const hasOutOfStock = productOptionIds.some((productOptionId) => {
      const inventoryItem = inventoryItems.find(
        (item) => item.productOptionId === productOptionId,
      );
      return !inventoryItem || inventoryItem.outOfStock;
    });

    return !hasOutOfStock;
  }
}
