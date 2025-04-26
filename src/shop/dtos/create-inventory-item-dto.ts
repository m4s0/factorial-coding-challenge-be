import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createInventoryItemSchema = z.object({
  productOptionId: z.string().uuid(),
  quantity: z
    .number({
      required_error: 'Quantity is required',
      description: 'Quantity available',
    })
    .min(0),

  outOfStock: z.boolean({
    description: 'Whether this item is marked as out of stock',
  }),
});

export class CreateInventoryItemDto extends createZodDto(
  createInventoryItemSchema,
) {}
