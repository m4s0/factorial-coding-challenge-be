import { compare } from 'bcrypt';

export async function isPasswordsMatch(
  password: string,
  encryptedPassword: string,
): Promise<boolean> {
  return compare(password, encryptedPassword);
}
