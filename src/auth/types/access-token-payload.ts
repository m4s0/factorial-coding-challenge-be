export type AccessTokenPayload = {
  id: string;
  isAdmin: boolean;
  username: string;
  firstName: string;
  lastName: string;
  iat: number;
  exp: number;
};
