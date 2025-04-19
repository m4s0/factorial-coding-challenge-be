import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createTestApp } from '../../../test/create-test.app';
import { AuthService } from '../services/auth.service';
import { loginSchema } from '../dtos/login.dto';
import { registerSchema } from '../dtos/register.dto';

describe('AuthController', () => {
  let app: INestApplication<App>;
  let authService: AuthService;

  beforeEach(async () => {
    app = await createTestApp();
    authService = app.get<AuthService>(AuthService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should successfully login', async () => {
      const expectedResponse = {
        accessToken: 'access_token',
      };

      jest
        .spyOn(AuthService.prototype, 'login')
        .mockResolvedValue(expectedResponse);

      const loginDto = {
        email: 'email@test.com',
        password: '!Email7890123456',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(expectedResponse);
      expect(authService.login).toHaveBeenCalledWith(
        loginSchema.parse(loginDto),
      );
    });

    it('should return an error if email is not a valid', async () => {
      const loginDto = {
        email: 'invalid-email',
        password: '!Email7890123456',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual({
        message: 'Validation failed',
        errors: [
          {
            validation: 'email',
            code: 'invalid_string',
            message: 'Invalid email',
            path: ['email'],
          },
        ],
      });
    });

    it('should return an error if password is not valid', async () => {
      const loginDto = {
        email: 'email@test.com',
        password: 'invalid-password',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual({
        message: 'Validation failed',
        errors: [
          {
            validation: 'regex',
            code: 'invalid_string',
            message: 'Invalid',
            path: ['password'],
          },
        ],
      });
    });
  });

  describe('POST /auth/register', () => {
    it('should successfully register', async () => {
      jest
        .spyOn(AuthService.prototype, 'register')
        .mockResolvedValue(undefined);

      const registerDto = {
        email: 'email@test.com',
        password: '!Email7890123456',
        username: 'username',
        firstName: 'firstName',
        lastName: 'lastName',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(authService.register).toHaveBeenCalledWith(
        registerSchema.parse(registerDto),
      );
    });

    it('should return an error if email is not a valid', async () => {
      const registerDto = {
        email: 'invalid-email',
        password: '!Email7890123456',
        username: 'username',
        firstName: 'firstName',
        lastName: 'lastName',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual({
        message: 'Validation failed',
        errors: [
          {
            validation: 'email',
            code: 'invalid_string',
            message: 'Invalid email',
            path: ['email'],
          },
        ],
      });
    });

    it('should return an error if password is not valid', async () => {
      const registerDto = {
        email: 'email@test.com',
        password: 'invalid-password',
        username: 'username',
        firstName: 'firstName',
        lastName: 'lastName',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual({
        message: 'Validation failed',
        errors: [
          {
            validation: 'regex',
            code: 'invalid_string',
            message: 'Invalid',
            path: ['password'],
          },
        ],
      });
    });

    it('should return an error if the username is missing', async () => {
      const registerDto = {
        email: 'email@test.com',
        password: '!Email7890123456',
        firstName: 'firstName',
        lastName: 'lastName',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual({
        message: 'Validation failed',
        errors: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['username'],
            message: 'Required',
          },
        ],
      });
    });

    it('should return an error if the firstName is missing', async () => {
      const registerDto = {
        email: 'email@test.com',
        password: '!Email7890123456',
        username: 'username',
        lastName: 'lastName',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual({
        message: 'Validation failed',
        errors: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['firstName'],
            message: 'Required',
          },
        ],
      });
    });

    it('should return an error if the lastName is missing', async () => {
      const registerDto = {
        email: 'email@test.com',
        password: '!Email7890123456',
        username: 'username',
        firstName: 'firstName',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerDto);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual({
        message: 'Validation failed',
        errors: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['lastName'],
            message: 'Required',
          },
        ],
      });
    });
  });
});
