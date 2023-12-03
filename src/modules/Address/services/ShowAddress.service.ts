import { AppError } from '@shared/error/AppError';
import { plainToInstance } from 'class-transformer';
import { inject, injectable } from 'tsyringe';
import { Address } from '../models/Address';
import { IAddressRepository } from '../repositories/AddressRepository.interface';
import { IShowAddressDTO } from './dto/ShowAddressDTO';

@injectable()
class ShowAddressService {
  constructor(
    @inject('AddressRepository')
    private addressRepository: IAddressRepository,
  ) {}

  public async execute({ id, request_id }: IShowAddressDTO): Promise<Address> {
    const address = await this.addressRepository.findBy({
      id,
      user_id: request_id,
    });

    if (!address) throw new AppError('Endereço não encontrado', 404);

    return plainToInstance(Address, address);
  }
}

export { ShowAddressService };
