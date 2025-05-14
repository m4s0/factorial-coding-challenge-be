import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { EntityManager } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '@User/entities/user.entity';
import { LogicException } from '@Common/exceptions/logic-exception';
import { createUUID } from '@Common/utils/create-uuid';
import { UsersService } from '@User/services/users.service';
import { hashPassword } from '@Auth/utils/hash-password';
import { RegisterInput } from '../types/register.input';
import { AuthService } from './auth.service';
import { createTestApp } from '../../../test/create-test.app';

describe('AuthService', () => {
  let app: INestApplication<App>;
  let entityManager: EntityManager;
  let jwtService: JwtService;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    app = await createTestApp();

    entityManager = app.get<EntityManager>(EntityManager);
    jwtService = app.get<JwtService>(JwtService);
    authService = app.get<AuthService>(AuthService);
    usersService = app.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('login()', () => {
    it('should login successfully and return accessToken', async () => {
      jest.spyOn(JwtService.prototype, 'sign').mockReturnValue('access_token');

      const password = await hashPassword('password');

      const user = await usersService.create({
        email: `${createUUID()}@email.com`,
        password,
        username: 'username',
        firstName: 'firstName',
        lastName: 'lastName',
      });

      const loginInput = {
        email: user.email,
        password,
      };

      const result = await authService.login(loginInput);

      expect(result).toMatchObject({ accessToken: 'access_token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: user.id,
        isAdmin: false,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    });

    it('should get an exception if user not exists', async () => {
      const loginInput = {
        email: 'test@email.com',
        password: 'password',
      };

      await expect(authService.login(loginInput)).rejects.toThrow(
        new LogicException(`User not found by email: ${loginInput.email}`),
      );
    });

    it('should get an exception if password does not match', async () => {
      const user = entityManager.create(User, {
        email: `${createUUID()}@email.com`,
        password: await hashPassword('password'),
      });
      await entityManager.save(user);

      const loginInput = {
        email: user.email,
        password: 'another-password',
      };

      await expect(authService.login(loginInput)).rejects.toThrow(
        new LogicException('Invalid credentials'),
      );
    });
  });

  describe('register()', () => {
    it('should register an user', async () => {
      const email = `${createUUID()}@email.com`;
      const password = 'password';

      const registerInput: RegisterInput = {
        email,
        password,
        username: 'username',
        firstName: 'firstName',
        lastName: 'lastName',
      };

      await authService.register(registerInput);

      const user = await usersService.findOneByEmail(registerInput.email);
      expect(user).toMatchObject({
        id: expect.any(String),
        email,
        password: expect.any(String),
        username: 'username',
        firstName: 'firstName',
        lastName: 'lastName',
      });
    });

    it('should get an exception if user already exists', async () => {
      const email = `${createUUID()}@email.com`;
      const password = await hashPassword('password');

      const user = entityManager.create(User, {
        email,
        password,
      });
      await entityManager.save(user);

      const registerInput = {
        email,
        password,
        username: 'username',
        firstName: 'firstName',
        lastName: 'lastName',
      };

      await expect(authService.register(registerInput)).rejects.toThrow(
        new LogicException('This email already exists'),
      );
    });
  });
});
