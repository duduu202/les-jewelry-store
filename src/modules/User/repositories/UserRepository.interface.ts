import { Prisma, User } from '@prisma/client';
import { IPaginatedRequest } from 'src/shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from 'src/shared/interfaces/IPaginatedResponse';
import { User as EntityUser } from '../models/User';
import { IUserCreate } from './dto/UserRepositoryDTO';

interface IUserRepository {
  findBy(
    filter: Partial<User>,
    include?: Prisma.UserInclude,
  ): Promise<EntityUser | null>;
  listBy(
    filter: IPaginatedRequest<User>,
  ): Promise<IPaginatedResponse<EntityUser>>;
  create(user: IUserCreate): Promise<User>;
  update(user: User): Promise<User>;
  remove(user: User): Promise<void>;
}

export { IUserRepository };
