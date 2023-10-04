import { Coupon } from '@prisma/client';
import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { ICouponRepository } from '../repositories/CouponRepository.interface';

@injectable()
class ShowCouponService {
  constructor(
    @inject('CouponRepository')
    private couponRepository: ICouponRepository,
  ) {}

  public async execute({
    id,
    request_id,
  }: {
    id: string;
    request_id: string;
  }): Promise<Coupon> {
    let coupon = await this.couponRepository.findBy({
      id,
      user_id: request_id,
    });

    if (!coupon) {
      coupon = await this.couponRepository.findBy({
        code: id,
        user_id: request_id,
      });
      if (!coupon) {
        throw new AppError('Endereço não encontrado', 404);
      }
    }

    return coupon;
  }
}

export { ShowCouponService };
