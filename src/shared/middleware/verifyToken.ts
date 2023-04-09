import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { jwt_config } from '@config/auth';
import { AppError } from '../error/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
  isMaster: boolean;
  permissions: string[];
  company_id?: string;
}

function verifyToken(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token JWT inexistente! T', 404);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, jwt_config.secret as string);

    const { sub, isMaster, permissions, company_id } = decoded as ITokenPayload;

    console.log('request user:');
    console.log({
      id: sub,
      isMaster,
      permissions,
      company_id,
    });
    request.user = {
      id: sub,
      isMaster,
      permissions,
      company_id,
    };

    return next();
  } catch (error) {
    throw new AppError('Token Inválido', 401);
  }
}

export { verifyToken };
