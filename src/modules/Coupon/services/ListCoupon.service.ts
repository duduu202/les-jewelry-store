import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { plainToInstance } from 'class-transformer';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { Coupon } from '@prisma/client';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { ICouponRepository } from '../repositories/CouponRepository.interface';

@injectable()
class ListCouponService {
  constructor(
    @inject('CouponRepository')
    private couponRepository: ICouponRepository,
  ) {}

  public async execute({
    filters,
    limit = 50,
    page = 1,
    include,
    search,
  }: IPaginatedRequest<Coupon>): Promise<IPaginatedResponse<Coupon>> {
    const allCoupons = await this.couponRepository.listBy({
      limit,
      page,
      include,
      search,
    });

    const filteredCoupons = allCoupons.results.filter(coupon => {
      // filter by user_id or by user_id undefined
      if (coupon.quantity <= 0) return false;
      if (!coupon.user_id) {
        return true;
      }
      if (filters?.user_id) {
        return coupon.user_id === filters.user_id;
      }
    });

    return {
      limit: allCoupons.limit,
      page: allCoupons.page,
      results: filteredCoupons,
      total: filteredCoupons.length,
    };
  }
}

export { ListCouponService };
