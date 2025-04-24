import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger, PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { addFilters } from './add-filters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<string>('PORT') ?? 3000;

  addFilters(app);

  app.use(helmet());
  app.enableCors();

  await app.listen(port);

  const logger = app.get<Logger>(Logger);
  logger.log(`Server is running on: ${await app.getUrl()}`, 'Bootstrap');
}

bootstrap().catch((error) => {
  const logger = new PinoLogger({
    pinoHttp: { level: 'error' },
    renameContext: 'Bootstrap',
  });
  logger.error(`Bootstrap error: ${error}`);
});
