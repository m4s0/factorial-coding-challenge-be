import { InventoryItem } from '@Shop/entities/inventory-item.entity';
import { EntityManager } from 'typeorm';

export async function createInventoryItem(
  entityManager: EntityManager,
  override: Partial<InventoryItem> = {},
): Promise<InventoryItem> {
  const inventoryItem = entityManager.create(InventoryItem, {
    ...override,
  });
  await entityManager.save(inventoryItem);

  return inventoryItem;
}
