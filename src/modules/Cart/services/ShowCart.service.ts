import { AppError } from '@shared/error/AppError';
import { plainToInstance } from 'class-transformer';
import { inject, injectable } from 'tsyringe';
import { Cart } from '../models/Cart';
import { ICartRepository } from '../repositories/CartRepository.interface';
import { IShowCartDTO } from './dto/ShowCartDTO';

@injectable()
class ShowCartService {
  constructor(
    @inject('CartRepository')
    private cartRepository: ICartRepository,
  ) {}

  public async execute({ id, request_id }: IShowCartDTO): Promise<Cart> {
    const cart = await this.cartRepository.findBy({
      id,
      user_id: request_id,
    });

    if (!cart) throw new AppError('Usuário não encontrado', 404);

    return plainToInstance(Cart, cart);
  }

  checkIfCartIsExpired(cart: Cart) {
    const cartDate = new Date(cart.created_at);
    const currentDate = new Date();

    const diffInMinutes = Math.abs(
      (cartDate.getTime() - currentDate.getTime()) / 1000 / 60,
    );

    // if (diffInMinutes > cart.) {
    //  throw new AppError('Carrinho expirado', 400);
    // }
  }
}

export { ShowCartService };
