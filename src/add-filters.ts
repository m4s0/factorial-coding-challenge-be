import { LogicExceptionFilter } from '@Common/filters/logic-exception-filter';
import { ZodValidationExceptionFilter } from '@Common/filters/zod-validation-exception.filter';
import { INestApplication } from '@nestjs/common';

export function addFilters(app: INestApplication): INestApplication {
  app.useGlobalFilters(
    new LogicExceptionFilter(),
    new ZodValidationExceptionFilter(),
  );

  return app;
}
