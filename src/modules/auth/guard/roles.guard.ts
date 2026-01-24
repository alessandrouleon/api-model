import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ROLES } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<ROLES[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.roles) {
            throw new ForbiddenException('Usuário não possui permissões');
        }

        const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];

        const hasRole = requiredRoles.some((role) => {
            const has = userRoles.includes(role);
            return has;
        });

        if (!hasRole) {
            throw new ForbiddenException(
                `Acesso negado. Permissões necessárias: ${requiredRoles.join(', ')}`
            );
        }

        return true;
    }
}