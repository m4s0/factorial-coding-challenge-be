import { InventoryItem } from '@Shop/entities/inventory-item.entity';
import { InventoryItemOutput } from '@Shop/types/inventory-item.output';

export function transformInventoryItem(
  inventoryItem: InventoryItem,
): InventoryItemOutput {
  return {
    id: inventoryItem.id,
    quantity: inventoryItem.quantity,
    outOfStock: inventoryItem.outOfStock,
    productOptionId: inventoryItem.productOptionId,
    createdAt: inventoryItem.createdAt.toISOString(),
    updatedAt: inventoryItem.updatedAt.toISOString(),
  };
}
