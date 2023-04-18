import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/error/AppError';
import { IHashProvider } from '@shared/container/providers/HashProvider/model/IHashProvider';
import { plainToInstance } from 'class-transformer';
import { IAddressRepository } from '../repositories/AddressRepository.interface';
import { ICreateAddressDTO } from './dto/CreateAddressDTO';
import { Address } from '../entities/Address';

@injectable()
class CreateAddressService {
  constructor(
    @inject('AddressRepository')
    private addressRepository: IAddressRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ ...addressParams }: ICreateAddressDTO): Promise<Address> {
    const address = await this.addressRepository.create({
      ...addressParams,
    });

    return plainToInstance(Address, address);
  }
}

export { CreateAddressService };
