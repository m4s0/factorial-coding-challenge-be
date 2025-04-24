import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const updateInventorySchema = z.object({
  quantity: z
    .number({
      required_error: 'Quantity is required',
      description: 'Quantity available',
    })
    .min(0),

  outOfStock: z
    .boolean({
      description: 'Whether this item is marked as out of stock',
    })
    .optional(),
});

export class UpdateInventoryDto extends createZodDto(updateInventorySchema) {}
