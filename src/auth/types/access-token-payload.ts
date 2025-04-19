import { UUID } from 'crypto';

export type AccessTokenPayload = {
  userId: UUID;
  email: string;
  iat: number;
  exp: number;
};
