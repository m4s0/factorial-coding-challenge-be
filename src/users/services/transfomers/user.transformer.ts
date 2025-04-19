import { User } from '../../entities/user.entity';
import { UserOutput } from '../../types/user.output';

export function userTransformer(user: User): UserOutput {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}
