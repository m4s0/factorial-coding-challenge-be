import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const updateCartQuantitySchema = z.object({
  quantity: z.number().min(1).int(),
});

export class UpdateCartQuantityDto extends createZodDto(
  updateCartQuantitySchema,
) {}
