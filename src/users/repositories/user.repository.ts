import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private profileRepository: Repository<User>,
  ) {}

  async findOneById(userId: string): Promise<User | null> {
    return this.profileRepository.findOneBy({ id: userId });
  }

  async findOneByEmail(email: string) {
    return this.profileRepository.findOneBy({ email });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.profileRepository.findOneBy({ username });
  }
}
