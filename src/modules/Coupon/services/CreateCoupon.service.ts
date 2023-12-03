import { Coupon, Coupon_type } from '@prisma/client';
import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { ICouponRepository } from '../repositories/CouponRepository.interface';

@injectable()
class CreateCouponService {
  constructor(
    @inject('CouponRepository')
    private couponRepository: ICouponRepository,
  ) {}

  public async execute({
    code,
    discount,
  }: {
    code: string;
    discount: number;
  }): Promise<Coupon> {
    return this.couponRepository.create({
      code,
      discount,
      type: Coupon_type.discount,
    });
  }
}

export { CreateCouponService };
