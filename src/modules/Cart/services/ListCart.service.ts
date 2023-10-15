import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { plainToInstance } from 'class-transformer';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { Paid_status } from '@prisma/client';
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
  }: IPaginatedRequest<Cart>): Promise<IPaginatedResponse<Cart>> {
    const cart = await this.cartRepository.listBy({
      filters,
      limit,
      page,
      include,
      search,
    });

    if (!cart) throw new AppError('Carrinho não encontrado', 404);

    return {
      results: plainToInstance(Cart, this.fixCurrentCart(cart.results)),
      page: cart.page,
      limit: cart.limit,
      total: cart.total,
    };
  }

  fixCurrentCart(carts: Cart[]): Cart[] {
    const currentCarts = carts.filter(cart => cart.is_current);

    // all current carts paid are not current anymore
    currentCarts.forEach(cart => {
      if (cart.paid_status === Paid_status.PAID) {
        cart.is_current = false;
        this.cartRepository.update(cart);
      }
    });

    return carts;
  }
}

export { ListCartService };
