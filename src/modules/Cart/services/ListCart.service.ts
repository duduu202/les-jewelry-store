import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { plainToInstance } from 'class-transformer';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { ICartRepository } from '../repositories/CartRepository.interface';
import { Cart } from '../entities/Cart';

@injectable()
class ListCartService {
  constructor(
    @inject('CartRepository')
    private cartRepository: ICartRepository,
  ) {}

  public async execute({
    filters,
    limit,
    page,
    include,
    search,
  }: IPaginatedRequest<Cart>): Promise<Cart> {
    // commit que eu não quero subir agora pro develop_main
    const cart = await this.cartRepository.listBy({
      filters,
      limit,
      page,
      include,
      search,
    });

    if (!cart) throw new AppError('Carrinho não encontrado', 404);

    return plainToInstance(Cart, cart);
  }
}

export { ListCartService };
