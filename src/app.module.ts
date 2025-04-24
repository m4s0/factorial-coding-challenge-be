import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger, LoggerModule } from 'nestjs-pino';
import { createUUID } from '@Common/utils/create-uuid';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtGuard } from '@Auth/guards/jwt.guard';
import { AuthModule } from '@Auth/auth.module';
import { ShopModule } from '@Shop/shop.module';
import { typeOrmModule } from './typeorm.module';

@Module({
  imports: [
    AuthModule,
    ShopModule,
    typeOrmModule,
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          pinoHttp: {
            level: configService.getOrThrow<string>('LOG_LEVEL'),
            genReqId: createUUID,
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useExisting: JwtGuard,
    },
    JwtGuard,
    Logger,
  ],
})
export class AppModule {}
