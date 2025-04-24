import { InventoryItem } from '@Shop/entities/inventory-item.entity';
import { transformInventoryItem } from './inventory-item.transformer';

describe('transformInventoryItem', () => {
  it('should transform inventory item with all fields correctly', () => {
    const inventoryItem = {
      id: 'inv_1',
      quantity: 100,
      outOfStock: false,
      productOptionId: 'opt_1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    } as InventoryItem;

    const result = transformInventoryItem(inventoryItem);

    expect(result).toMatchSnapshot();
  });

  it('should transform inventory item with zero quantity and out of stock', () => {
    const inventoryItem = {
      id: 'inv_2',
      quantity: 0,
      outOfStock: true,
      productOptionId: 'opt_2',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    } as InventoryItem;

    const result = transformInventoryItem(inventoryItem);

    expect(result).toMatchSnapshot();
  });
});
