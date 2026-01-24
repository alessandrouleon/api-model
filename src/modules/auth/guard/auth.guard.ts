import { jwtConstants } from '@/modules/auth/constants/auth-user.secret';
import { IS_PUBLIC_KEY } from '@/modules/auth/decorators/public.decorator';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  username: string;
  userId: string;
  roles?: string | string[];
  sub?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verifica se a rota é pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: jwtConstants.secret,
        algorithms: ['HS256'],
      });

      // Validações essenciais do payload
      this.validatePayload(payload);

      // Anexa usuário ao request com roles normalizadas
      request.user = {
        username: payload.username,
        userId: payload.userId,
        roles: this.normalizeRoles(payload.roles),
      };

      return true;
    } catch (error) {
      // Preserva mensagens de UnauthorizedException customizadas
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Trata erros do JWT (token expirado, assinatura inválida, etc)
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  /**
   * Valida se o payload contém os dados mínimos necessários
   */
  private validatePayload(payload: JwtPayload): void {
    if (!payload.username || !payload.userId) {
      throw new UnauthorizedException('Token inválido - dados incompletos');
    }
  }

  /**
   * Normaliza roles para sempre retornar um array de strings válidas
   */
  private normalizeRoles(roles: unknown): string[] {
    if (!roles) {
      return ['USER'];
    }

    if (Array.isArray(roles)) {
      const validRoles = roles.filter(
        (role) => typeof role === 'string' && role.trim().length > 0,
      );
      return validRoles.length > 0 ? validRoles : ['USER'];
    }

    if (typeof roles === 'string' && roles.trim().length > 0) {
      return [roles.trim()];
    }

    return ['USER'];
  }
}
