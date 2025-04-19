import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { LogicException } from '../exceptions/logic-exception';

@Catch(LogicException)
export class LogicExceptionFilter<T extends LogicException>
  implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json(exception.message);
  }
}
