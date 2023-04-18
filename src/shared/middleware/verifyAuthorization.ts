import { jwt_config } from '@config/auth';
import { AppError } from '@shared/error/AppError';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { UserRole as UserRoles } from '@prisma/client';

/**
 *
 * @param {UserRoles[]} role - Array de permissões que o usuário deve ter para acessar a rota
 *
 */
export default function verifyAuthorization(
  allowRoles: UserRoles[],
): any {
  return (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new AppError('Token JWT inexistente! A', 404);
    }
    const [, token] = authHeader.split(' ');

    if (allowRoles.length) {
      if (!request.headers.authorization) {
        throw new AppError('Usúario não autorizado', 401);
      }
      const tokenData = verify(
        token,
        jwt_config.secret as string,
      ) as JwtPayload;
      if (allowRoles instanceof Array<string>) {
        if (
          !tokenData.role ||
          !allowRoles.some(perm => tokenData.role.includes(perm))
        ) {
          throw new AppError('Usúario não autorizado', 401);
        }
      }
    }

    return next();
  };
}
