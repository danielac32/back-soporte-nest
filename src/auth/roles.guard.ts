import { Injectable, BadRequestException , ForbiddenException ,CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from './decorators/role-protected.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string | string[]>(META_ROLES, context.getHandler());

    // Si no hay roles definidos, permitir el acceso
    if (!roles) {
      return true;
    }

    // Obtener el usuario desde la solicitud
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificar si el rol del usuario está permitido
    if (Array.isArray(roles)) {
      // Si roles es un array, verificar si el rol del usuario está incluido
      if (roles.includes(user.role)) {
        return true;
      }
    } else {
      // Si roles es un solo valor, comparar directamente
      if (roles === user.role) {
        return true;
      }
    }

    // Si el rol no está permitido, lanzar una excepción
    throw new ForbiddenException(`User ${user.name} needs a valid role: ${roles}`);
  }
}
