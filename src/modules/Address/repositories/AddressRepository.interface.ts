import { Address } from '@prisma/client';
import { IPaginatedRequest } from 'src/shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from 'src/shared/interfaces/IPaginatedResponse';
import { Address as EntityAddress } from '../entities/Address';
import { IAddressCreate } from './dto/AddressRepositoryDTO';

interface IAddressRepository {
  findBy(
    filter: Partial<Address>,
    //include?: { [key: string]: boolean },
  ): Promise<EntityAddress | null>;
  listBy(
    filter: IPaginatedRequest<Address>,
  ): Promise<IPaginatedResponse<EntityAddress>>;
  create(address: IAddressCreate): Promise<Address>;
  update(address: Address): Promise<Address>;
  remove(address: Address): Promise<void>;
}

export { IAddressRepository };
