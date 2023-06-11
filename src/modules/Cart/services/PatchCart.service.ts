import { UserRepository } from '@modules/User/repositories/UserRepository';
import { AppError } from '@shared/error/AppError';
import { plainToInstance } from 'class-transformer';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '@modules/User/repositories/UserRepository.interface';
import { Cart_status } from '@prisma/client';
import { Cart } from '../entities/Cart';
import { ICartRepository } from '../repositories/CartRepository.interface';
import { IPatchCartDTO } from './dto/PatchCartDTO';

@injectable()
class PatchCartService {
  constructor(
    @inject('CartRepository')
    private cartRepository: ICartRepository,

    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ id, request_id }: IPatchCartDTO): Promise<Cart> {
    const cart = await this.cartRepository.findBy({
      id,
    });
    const user = await this.userRepository.findBy({
      id: request_id,
    });

    if (!user || user.role !== 'Master')
      throw new AppError('Operação não autorizada', 401);
    if (!cart) throw new AppError('Carrinho não encontrado', 404);
    if (cart.status !== 'APROVADA')
      throw new AppError('Carrinho não pago', 401);

    cart.status = Cart_status.EM_TRANSITO;
    this.cartRepository.update(cart);

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

export { PatchCartService };
