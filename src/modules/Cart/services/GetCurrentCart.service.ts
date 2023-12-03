import { AppError } from '@shared/error/AppError';
import { plainToInstance } from 'class-transformer';
import { inject, injectable } from 'tsyringe';
import { Paid_status } from '@prisma/client';
import { IUserRepository } from '@modules/User/repositories/UserRepository.interface';
import { Cart } from '../models/Cart';
import { ICartRepository } from '../repositories/CartRepository.interface';
import { IGetCurrentCartDTO } from './dto/GetCurrentCartDTO';

@injectable()
class GetCurrentCartService {
  constructor(
    @inject('CartRepository')
    private cartRepository: ICartRepository,

    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ request_id }: IGetCurrentCartDTO): Promise<Cart> {
    const user = await this.userRepository.findBy(
      {
        id: request_id,
      },
      {
        current_cart: {
          include: {
            cart_items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    );
    if (!user) throw new AppError('Usuário não encontrado', 404);

    if (user.current_cart) {
      this.checkIfCartIsExpired(user.current_cart);
      return plainToInstance(Cart, user.current_cart);
    }

    const newCart = await this.cartRepository.create({
      user_id: request_id,
      cart_items: [],
    });

    user.current_cart_id = newCart.id;

    await this.userRepository.update(user);

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
