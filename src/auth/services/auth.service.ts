import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@User/services/users.service';
import { User } from '@User/entities/user.entity';
import { UserRepository } from '@User/repositories/user.repository';
import { LogicException } from '@Common/exceptions/logic-exception';
import { RegisterInput } from '../types/register.input';
import { LoginInput } from '../types/login.input';
import { AccessTokenOutput } from '../types/access-token.output';
import { isPasswordsMatch } from '../utils/is-passwords-match';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(input: LoginInput): Promise<AccessTokenOutput> {
    const { email, password } = input;

    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new LogicException(`User not found by email: ${email}`);
    }

    const isPasswordMatch = await isPasswordsMatch(password, user.password);
    if (!isPasswordMatch) {
      throw new LogicException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return { accessToken };
  }

  async register(input: RegisterInput): Promise<void> {
    const { email, password, username, firstName, lastName } = input;

    await this.usersService.create({
      email,
      password,
      username,
      firstName,
      lastName,
    });
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new LogicException(`User not found by email: ${email}`);
    }

    const isPasswordMatch = await isPasswordsMatch(password, user.password);
    if (!isPasswordMatch) {
      throw new LogicException('Password does not match');
    }

    return user;
  }
}
