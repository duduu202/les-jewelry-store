import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { ICartRepository } from '../repositories/CartRepository.interface';
import { IDeleteCartDTO } from './dto/DeleteCartDTO';

@injectable()
class DeleteCartService {
  constructor(
    @inject('CartRepository')
    private cartRepository: ICartRepository,
  ) {}

  public async execute({ id, request_id }: IDeleteCartDTO): Promise<void> {
    const cart = await this.cartRepository.findBy({ id, user_id: request_id });

    if (!cart) throw new AppError('Carrinho não encontrado', 404);

    await this.cartRepository.remove(cart);
  }
}

export { DeleteCartService };
