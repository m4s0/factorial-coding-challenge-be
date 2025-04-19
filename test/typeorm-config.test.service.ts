import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { getDataSourceOptions } from '../src/get-data-source-options';

@Injectable()
export class TypeOrmConfigTestService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...getDataSourceOptions(this.configService),
      database: this.configService.getOrThrow<string>('DB_DATABASE_TEST'),
      autoLoadEntities: true,
      synchronize: true,
    } as TypeOrmModuleOptions;
  }
}
