import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { IAddressRepository } from '../repositories/AddressRepository.interface';
import { IDeleteAddressDTO } from './dto/DeleteAddressDTO';

@injectable()
class DeleteAddressService {
  constructor(
    @inject('AddressRepository')
    private addressRepository: IAddressRepository,
  ) {}

  public async execute({ id, request_id }: IDeleteAddressDTO): Promise<void> {
    const address = await this.addressRepository.findBy({ id, user_id: request_id });

    if (!address) throw new AppError('Enderço não encontrado', 404);

    await this.addressRepository.remove(address);
  }
}

export { DeleteAddressService };
