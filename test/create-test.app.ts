import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtGuard } from '@Auth/guards/jwt.guard';
import helmet from 'helmet';
import { MockedJwtGuard } from './mocks/guards/jwt.guard';
import { AppModule } from '../src/app.module';
import { TypeOrmConfigTestService } from './typeorm-config.test.service';
import { typeOrmModule } from '../src/typeorm.module';
import { addFilters } from '../src/add-filters';

export async function createTestApp(): Promise<INestApplication<App>> {
  const testingModule: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideModule(typeOrmModule)
    .useModule(
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useClass: TypeOrmConfigTestService,
      }),
    )
    .overrideProvider(JwtGuard)
    .useClass(MockedJwtGuard)
    .compile();

  const app = testingModule.createNestApplication({ logger: false });

  addFilters(app);

  app.use(helmet());

  await app.init();

  return app;
}
