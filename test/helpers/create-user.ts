import { EntityManager } from 'typeorm';
import { User } from '@User/entities/user.entity';
import { createUUID } from '@Common/utils/create-uuid';
import { hashPassword } from '@Auth/utils/hash-password';

export async function createUser(
  entityManager: EntityManager,
  override: Partial<User> = {},
): Promise<User> {
  const user = entityManager.create(User, {
    email: `${createUUID()}@email.com`,
    password: await hashPassword('password'),
    ...override,
  });

  await entityManager.save(user);

  return user;
}
