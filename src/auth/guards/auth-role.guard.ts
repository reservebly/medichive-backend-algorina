import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decarator';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();

        // Role check
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.split(' ')[1];

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      (req as any).user = payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const userRole = payload.role;

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException('You do not have access to this resource');
    }

    return true;
  }
}
