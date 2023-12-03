import { Prisma, User } from '@prisma/client';
import { prisma } from '@shared/database';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { prisma_cache_time } from '@config/prismaCacheTime';
import { IUserCreate } from './dto/UserRepositoryDTO';
import { IUserRepository } from './UserRepository.interface';
import { User as EntityUser } from '../models/User';

class UserRepository implements IUserRepository {
  async findBy(
    filter: Partial<User>,
    include?: Prisma.UserInclude,
  ): Promise<EntityUser | null> {
    const user = await prisma.user.findFirst({
      where: { ...filter },
      include: include || {
        address: true,
      },
    });

    return user as EntityUser;
  }

  public async listBy({
    page = 1,
    limit = undefined,
    filters,
    search,
  }: IPaginatedRequest<User>): Promise<IPaginatedResponse<EntityUser>> {
    const users = await prisma.user.findMany({
      where: filters && {
        ...filters,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip: limit ? (page - 1) * limit : undefined,
      take: limit,
      cacheStrategy: { ...prisma_cache_time },
    });

    const userTotal = await prisma.user.count({
      where: filters && {
        ...filters,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      cacheStrategy: { ...prisma_cache_time },
    });

    return {
      results: users as EntityUser[],
      total: userTotal,
      page,
      limit,
    };
  }

  async create({
    name,
    email,
    password,
    CPF,
    phone,
  }: IUserCreate): Promise<User> {
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

  async update({ id, ...user }: User): Promise<User> {
    console.log('user', user);
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        CPF: user.CPF,
        charge_address_id: user.charge_address_id,
        current_cart_id: user.current_cart_id,
        delivery_address_id: user.delivery_address_id,
        email: user.email,
        name: user.name,
        password: user.password,
        phone: user.phone,
        role: user.role,
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
