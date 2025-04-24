import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const addToCartSchema = z.object({
  productId: z.string().uuid(),
  optionIds: z.array(z.string().uuid()),
  quantity: z.number().min(1).int(),
});

export class AddToCartDto extends createZodDto(addToCartSchema) {}
