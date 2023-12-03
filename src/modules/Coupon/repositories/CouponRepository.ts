import { prisma_cache_time } from '@config/prismaCacheTime';
import { Coupon, Coupon_type } from '@prisma/client';
import { prisma } from '@shared/database';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { ICouponRepository } from './CartRepository.interface';
import { ICouponCreate } from './dto/CuponRepositoryDTO';

class CouponRepository implements ICouponRepository {
  async findBy(filter: Partial<Coupon>): Promise<Coupon | null> {
    const coupon = await prisma.coupon.findFirst({
      where: { ...filter },
    });

    return coupon as Coupon;
  }

  public async listBy({
    page = 1,
    limit = 10,
    filters,
  }: IPaginatedRequest<Coupon>): Promise<IPaginatedResponse<Coupon>> {
    const coupones = await prisma.coupon.findMany({
      where: filters && {
        ...filters,
      },
      skip: (page - 1) * limit,
      take: limit,
      // cacheStrategy: { ...prisma_cache_time },
    });

    const couponTotal = await prisma.coupon.count({
      where: filters && {
        ...filters,
      },
      // cacheStrategy: { ...prisma_cache_time },
    });

    return {
      results: coupones as Coupon[],
      total: couponTotal,
      page,
      limit,
    };
  }

  async create({
    type = Coupon_type.exchange,
    ...datas
  }: ICouponCreate): Promise<Coupon> {
    const coupon = await prisma.coupon.create({
      data: {
        code: datas.code,
        discount: datas.discount,
        expires_at: datas.expires_at,
        type,
        user_id: datas.user_id,
      },
    });
    return coupon;
  }

  async update({ id, ...datas }: Coupon): Promise<Coupon> {
    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...datas,
      },
    });

    return updatedCoupon;
  }

  async remove(coupon: Coupon): Promise<void> {
    await prisma.coupon.delete({
      where: { id: coupon.id },
    });
  }
}

export { CouponRepository };
