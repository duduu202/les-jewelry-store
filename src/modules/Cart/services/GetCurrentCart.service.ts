import { AppError } from '@shared/error/AppError';
import { plainToInstance } from 'class-transformer';
import { inject, injectable } from 'tsyringe';
import { Cart } from '../entities/Cart';
import { ICartRepository } from '../repositories/CartRepository.interface';
import { IGetCurrentCartDTO } from './dto/GetCurrentCartDTO';

@injectable()
class GetCurrentCartService {
  constructor(
    @inject('CartRepository')
    private cartRepository: ICartRepository,
  ) {}

  public async execute({ request_id }: IGetCurrentCartDTO): Promise<Cart> {
    const cart = await this.cartRepository.findBy({
      user_id: request_id,
      is_current: true,
    });

    if (cart) return plainToInstance(Cart, cart);

    const newCart = await this.cartRepository.create({
      user_id: request_id,
      cart_items: [],
      is_current: true,
    });

    return plainToInstance(Cart, newCart);
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

export { GetCurrentCartService };
