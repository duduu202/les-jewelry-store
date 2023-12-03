import { Address } from '@prisma/client';
import { prisma } from '@shared/database';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { prisma_cache_time } from '@config/prismaCacheTime';
import { IAddressCreate } from './dto/AddressRepositoryDTO';
import { IAddressRepository } from './AddressRepository.interface';
import { Address as EntityAddress } from '../models/Address';

class AddressRepository implements IAddressRepository {
  async findBy(
    filter: Partial<Address>,
    // include?: { [key: string]: boolean },
  ): Promise<EntityAddress | null> {
    const address = await prisma.address.findFirst({
      where: { ...filter },
    });

    return address as EntityAddress;
  }

  public async listBy({
    page = 1,
    limit = 10,
    filters,
  }: // search,
  IPaginatedRequest<Address>): Promise<IPaginatedResponse<EntityAddress>> {
    const addresses = await prisma.address.findMany({
      where: filters && {
        ...filters,
        // name: {
        //  contains: search,
        //  mode: 'insensitive',
        // },
      },
      include: {
        user: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      // cacheStrategy: { ...prisma_cache_time },
    });

    const addressTotal = await prisma.address.count({
      where: filters && {
        ...filters,
        // name: {
        //  contains: search,
        //  mode: 'insensitive',
        // },
      },
      // cacheStrategy: { ...prisma_cache_time },
    });

    return {
      results: addresses as EntityAddress[],
      total: addressTotal,
      page,
      limit,
    };
  }

  async create({
    street,
    number,
    district,
    city,
    state,
    zip_code,
    user_id,
  }: IAddressCreate): Promise<Address> {
    const address = await prisma.address.create({
      data: {
        street,
        number,
        district,
        city,
        state,
        zip_code,
        user_id,
      },
    });
    return address;
  }

  async update({
    id,
    street,
    number,
    district,
    city,
    state,
    zip_code,
  }: Address): Promise<Address> {
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        street,
        number,
        district,
        city,
        state,
        zip_code,
      },
    });

    return updatedAddress;
  }

  async remove(address: Address): Promise<void> {
    await prisma.address.delete({
      where: { id: address.id },
    });
  }
}

export { AddressRepository };
