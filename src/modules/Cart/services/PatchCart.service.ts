import { UserRepository } from '@modules/User/repositories/UserRepository';
import { AppError } from '@shared/error/AppError';
import { plainToInstance } from 'class-transformer';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '@modules/User/repositories/UserRepository.interface';
import { Cart_status, Coupon_type, Paid_status } from '@prisma/client';
import { Cart } from '../entities/Cart';
import { ICartRepository } from '../repositories/CartRepository.interface';
import { IPatchCartDTO } from './dto/PatchCartDTO';
import { ICouponRepository } from '@modules/Coupon/repositories/CouponRepository.interface';

@injectable()
class PatchCartService {
  constructor(
    @inject('CartRepository')
    private cartRepository: ICartRepository,

    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('CouponRepository')
    private couponRepository: ICouponRepository,
  ) {}

  public async execute({
    id,
    request_id,
    status,
  }: IPatchCartDTO): Promise<Cart> {
    const cart = await this.cartRepository.findBy({
      id,
    });
    const user = await this.userRepository.findBy({
      id: request_id,
    });
    if (!user || user.role !== 'Master') {
      throw new AppError('Operação não autorizada', 401);
    }
    if (!cart) throw new AppError('Carrinho não encontrado', 404);
    if (status === cart.status) return cart;
    if (
      status === Cart_status.EM_TRANSITO &&
      cart.status !== Cart_status.APROVADA
    ) {
      throw new AppError('Carrinho não pago', 401);
    }

    if (status === Cart_status.TROCA_AUTORIZADA) {
      if (cart.paid_status === Paid_status.REFUNDED)
        throw new AppError('Carrinho já foi trocado', 401);
      const coupon = await this.generateCoupon(cart);
      cart.paid_status = Paid_status.REFUNDED;
      console.log('generated coupon: ', coupon);
    }

    cart.status = status;
    this.cartRepository.update({
      id: cart.id,
      address_id: cart.address_id,
      cart_items: cart.cart_items,
      cart_payment_cards: cart.cart_payment_cards,
      paid_status: cart.paid_status,
      status: cart.status,
      user_id: cart.user_id,
      coupon_ids: cart.coupons.map(coupon => coupon.id),
      cupom_id: cart.cupom_id,
      delivery_fee: 0,
      created_at: cart.created_at,
      expires_at: cart.expires_at,
      updated_at: cart.updated_at,
    });

    return plainToInstance(Cart, cart);
  }

  generateCoupon(cart: Cart) {
    const value = cart.cart_items.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);
    const coupon = this.couponRepository.create({
      user_id: cart.user_id,
      code: 'TROCA-' + value.toFixed(2),
      discount: value,
      type: Coupon_type.exchange,
    });
    return coupon;
  }
}

export { PatchCartService };
