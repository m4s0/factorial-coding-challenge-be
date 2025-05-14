import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { RegisterInput } from '@Auth/types/register.input';
import { LogicException } from '@Common/exceptions/logic-exception';
import { hashPassword } from '@Auth/utils/hash-password';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';

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

  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findOneById(userId);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneByEmail(email);
  }
}
