import { UserPermissions, UserStatus } from '@prisma/client';

interface IUpdateUserDTO {
  request_id: string;
  user_id?: string;
  name: string;
  CPF?: string;
  email?: string;
  phone?: string;
  isMaster: boolean;
  password?: string;
}

export { IUpdateUserDTO };
