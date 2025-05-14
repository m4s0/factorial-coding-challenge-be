import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UpdateInventoryItemInput } from '@Shop/types/update-inventory-item.input';
import { InventoryItemRepository } from '@Shop/repositories/inventory-item.repository';
import { CreateInventoryItemInput } from '@Shop/types/create-inventory-item.input';
import { InventoryItem } from '../entities/inventory-item.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly inventoryRepository: InventoryItemRepository,
  ) {}

  async getAll(): Promise<InventoryItem[]> {
    return this.inventoryRepository.findAll();
  }

  async getById(id: string): Promise<InventoryItem> {
    const inventoryItem = await this.inventoryRepository.findOneById(id);

    if (!inventoryItem) {
      throw new NotFoundException(`InventoryItem with ID ${id} not found`);
    }

    return inventoryItem;
  }

  async create(input: CreateInventoryItemInput): Promise<InventoryItem> {
    const optionRule = this.entityManager.create(InventoryItem, input);

    return this.entityManager.save(optionRule);
  }

  async update(
    id: string,
    input: UpdateInventoryItemInput,
  ): Promise<InventoryItem> {
    const existingInventoryItem = await this.getById(id);

    this.entityManager.merge(InventoryItem, existingInventoryItem, input);
    return this.entityManager.save(existingInventoryItem);
  }

  async remove(id: string): Promise<void> {
    const existingInventoryItem = await this.getById(id);

    await this.entityManager.remove(existingInventoryItem);
  }

  async getInventoryByProduct(id: string): Promise<InventoryItem> {
    const inventoryItem = await this.inventoryRepository.findOneByProductId(id);

    if (!inventoryItem) {
      throw new NotFoundException(`InventoryItem with ID ${id} not found`);
    }

    return inventoryItem;
  }
}
