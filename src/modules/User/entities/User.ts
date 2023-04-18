import { Exclude } from 'class-transformer';
import { User as IUser, UserRole } from '@prisma/client';

class User implements IUser {
  phone: string;
  
  id: string;

  name: string;

  CPF: string | null;

  email: string;

  @Exclude()
  password: string;

  role: UserRole;

  created_at: Date;

  updated_at: Date;
}

export { User };
