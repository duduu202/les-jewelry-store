import { Coupon } from '@prisma/client';
import { AppError } from '@shared/error/AppError';
import { plainToInstance } from 'class-transformer';
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
    const coupon = await this.couponRepository.findBy({
      id: id,
      user_id: request_id,
    });

    if (!coupon) throw new AppError('Endereço não encontrado', 404);

    return coupon;
  }
}

export { ShowCouponService };
