import { User } from '@prisma/client';
import { prisma } from '@shared/database';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { IUserCreate } from './dto/UserRepositoryDTO';
import { IUserRepository } from './UserRepository.interface';
import { User as EntityUser } from '../entities/User';

class UserRepository implements IUserRepository {
  async findBy(
    filter: Partial<User>,
    include?: { [key: string]: boolean },
  ): Promise<EntityUser | null> {
    const user = await prisma.user.findFirst({
      where: { ...filter },
    });

    return user as EntityUser;
  }

  public async listBy({
    page = 1,
    limit = 10,
    filters,
    search,
  }: IPaginatedRequest<User>): Promise<IPaginatedResponse<EntityUser>> {
    console.log('search');
    console.log(search);
    const users = await prisma.user.findMany({
      where: filters && {
        ...filters,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const userTotal = await prisma.user.count({
      where: filters && {
        ...filters,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    return {
      results: users as EntityUser[],
      total: userTotal,
      page,
      limit,
    };
  }

  async create({ name, email, password, CPF, phone }: IUserCreate): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        CPF,
        phone,
      },
    });
    return user;
  }

  async update({ name, email, password, role, id, CPF, phone }: User): Promise<User> {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password,
        role,
        CPF,
        phone
      },
    });

    return updatedUser;
  }

  async remove(user: User): Promise<void> {
    await prisma.user.delete({
      where: { id: user.id },
    });
  }
}

export { UserRepository };
