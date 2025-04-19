import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { RegisterInput } from '../../auth/types/register.input';
import { LogicException } from '../../common/exceptions/logic-exception';
import { hashPassword } from '../../auth/utils/hash-password';

@Injectable()
export class UsersService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly userRepository: UserRepository,
  ) {}

  async create(input: RegisterInput): Promise<User> {
    const { email, password } = input;

    const existingUser = await this.userRepository.findOneByEmail(email);
    if (existingUser) {
      throw new LogicException('This email already exists');
    }

    return this.entityManager.save(User, {
      email,
      password: await hashPassword(password),
      username: input.username,
      firstName: input.firstName,
      lastName: input.lastName,
    });
  }
}
