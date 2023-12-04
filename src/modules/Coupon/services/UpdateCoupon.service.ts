import { Coupon, Coupon_type } from '@prisma/client';
import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { ICouponRepository } from '../repositories/CouponRepository.interface';

@injectable()
class UpdateCouponService {
  constructor(
    @inject('CouponRepository')
    private couponRepository: ICouponRepository,
  ) {}

  public async execute({
    id,
    code,
    discount,
    quantity,
  }: {
    id: string;
    code?: string;
    discount?: number;
    quantity?: number;
  }): Promise<Coupon> {
    let coupon = await this.couponRepository.findBy({
      id,
    });

    if (!coupon) {
      coupon = await this.couponRepository.findBy({
        code: id,
      });

      if (!coupon) {
        throw new AppError('Cupom não encontrado', 404);
      }
    }
    if (code) coupon.code = code;
    if (discount) coupon.discount = discount;
    if (quantity) coupon.quantity = quantity;
    await this.couponRepository.update(coupon);

    return coupon;
  }
}

export { UpdateCouponService };
