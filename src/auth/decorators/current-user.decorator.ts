import { LogicException } from '@Common/exceptions/logic-exception';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@User/entities/user.entity';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<Request & { user: User }>();

    if (!request.user) {
      throw new LogicException('User not found in request');
    }

    return request.user;
  },
);
