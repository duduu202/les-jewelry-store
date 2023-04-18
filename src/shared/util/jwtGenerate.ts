import { jwt_config } from '@config/auth';
import { UserRole } from '@prisma/client';
import { sign } from 'jsonwebtoken';

export const jwtGenerate = (sub: string, isMaster: boolean, role: UserRole): string => {
  return sign({ sub, isMaster, role }, jwt_config.secret, {
    expiresIn: jwt_config.expiresIn,
  });
};
