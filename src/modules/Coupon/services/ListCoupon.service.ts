import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { plainToInstance } from 'class-transformer';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { ICouponRepository } from '../repositories/CouponRepository.interface';
import { Coupon } from '@prisma/client';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';

@injectable()
class ListCouponService {
  constructor(
    @inject('CouponRepository')
    private couponRepository: ICouponRepository,
  ) {}

  public async execute({
    filters,
    limit,
    page,
    include,
    search,
  }: IPaginatedRequest<Coupon>): Promise<IPaginatedResponse<Coupon>> {
    const coupon = await this.couponRepository.listBy({
      filters,
      limit,
      page,
      include,
      search,
    });

    if (!coupon) throw new AppError('Endereço não encontrado', 404);

    return coupon;
  }
}

export { ListCouponService };
