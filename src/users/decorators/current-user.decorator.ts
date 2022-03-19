import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { userInfo } from 'os';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
