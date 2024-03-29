import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { plainToInstance } from 'class-transformer';
import { IAddressRepository } from '../repositories/AddressRepository.interface';
import { IUpdateAddressDTO } from './dto/UpdateAddressDTO';
import { Address } from '../models/Address';

@injectable()
class UpdateAddressService {
  constructor(
    @inject('AddressRepository')
    private addressRepository: IAddressRepository,
  ) {}

  public async execute({
    id,
    request_id,
    ...addressParams
  }: IUpdateAddressDTO): Promise<Address> {
    console.log('addressParams', id);
    const address = await this.addressRepository.findBy({
      id,
      user_id: request_id,
    });

    if (!address) throw new AppError('Endereço não encontrado', 404);

    Object.assign(address, addressParams);

    const newAddress = await this.addressRepository.update(address);

    return plainToInstance(Address, newAddress);
  }
}

export { UpdateAddressService };
