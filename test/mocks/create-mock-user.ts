import { User } from '@User/entities/user.entity';
import { UserRole } from '@User/entities/user-role';

export function createMockUser(): User {
  return {
    id: '9b4f51fd-35f9-4c23-bd6e-969f1b76888a',
    email: 'test@email.com',
    password: 'password',
    username: 'username',
    firstName: 'firstName',
    lastName: 'lastName',
    isActive: true,
    roles: [UserRole.ADMIN],
  } as User;
}
