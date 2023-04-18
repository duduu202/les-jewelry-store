import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { plainToInstance } from 'class-transformer';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IAddressRepository } from '../repositories/AddressRepository.interface';
import { Address } from '../entities/Address';

@injectable()
class ListAddressService {
  constructor(
    @inject('AddressRepository')
    private addressRepository: IAddressRepository,
  ) {}

  public async execute({
    filters,
    limit,
    page,
    include,
    search,
  }: IPaginatedRequest<Address>): Promise<Address> {
    const address = await this.addressRepository.listBy({
      filters,
      limit,
      page,
      include,
      search,
    });

    if (!address) throw new AppError('Endereço não encontrado', 404);

    return plainToInstance(Address, address);
  }
}

export { ListAddressService };
