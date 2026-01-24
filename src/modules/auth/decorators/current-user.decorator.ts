import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ROLES } from '../enums/roles.enum';

export interface ICurrentUser {
    username: string;
    userId: string;
    roles: ROLES[];
}

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): ICurrentUser => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);