import { UserPermissions, UserStatus } from '@prisma/client';

interface IUpdateUserDTO {
  user_id?: string;
  name: string;
  CPF?: string;
  email?: string;
  phone?: string;
}

export { IUpdateUserDTO };
