import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { passwordValidation } from './password-validation';

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().regex(passwordValidation),
  })
  .required();

export class LoginDto extends createZodDto(loginSchema) {}
