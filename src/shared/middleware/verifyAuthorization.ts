// import { jwt_config } from '@config/auth';
// import { AppError } from '@shared/error/AppError';
// import { Request, Response, NextFunction } from 'express';
// import { JwtPayload, verify } from 'jsonwebtoken';
// import { UserPermissions } from '@prisma/client';
//
/// **
// *
// * @param {UserPermissions[]} permissions - Array de permissões que o usuário deve ter para acessar a rota
// *
// */
// export default function verifyAuthorization(
//  allowPermissions: UserPermissions[],
// ): any {
//  return (request: Request, response: Response, next: NextFunction) => {
//    const authHeader = request.headers.authorization;
//
//    if (!authHeader) {
//      throw new AppError('Token JWT inexistente! A', 404);
//    }
//    const [, token] = authHeader.split(' ');
//
//    if (allowPermissions.length) {
//      if (!request.headers.authorization) {
//        throw new AppError('Usúario não autorizado', 401);
//      }
//      const tokenData = verify(
//        token,
//        jwt_config.secret as string,
//      ) as JwtPayload;
//      if (allowPermissions instanceof Array<string>) {
//        if (
//          !tokenData.permissions ||
//          !allowPermissions.some(perm => tokenData.permissions.includes(perm))
//        ) {
//          throw new AppError('Usúario não autorizado', 401);
//        }
//      }
//    }
//
//    return next();
//  };
// }
