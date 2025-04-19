import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { passwordValidation } from './password-validation';

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().regex(passwordValidation),
    username: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  })
  .required();

export class RegisterDto extends createZodDto(registerSchema) {}
