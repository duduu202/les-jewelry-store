import { Coupon } from '@prisma/client';
import { IPaginatedRequest } from 'src/shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from 'src/shared/interfaces/IPaginatedResponse';
import { ICouponCreate } from './dto/CuponRepositoryDTO';
interface ICouponRepository {
  findBy(
    filter: Partial<Coupon>,
    //include?: { [key: string]: boolean },
  ): Promise<Coupon | null>;
  listBy(
    filter: IPaginatedRequest<Coupon>,
  ): Promise<IPaginatedResponse<Coupon>>;
  create(coupon: ICouponCreate): Promise<Coupon>;
  update(coupon: Coupon): Promise<Coupon>;
  remove(coupon: Coupon): Promise<void>;
}

export { ICouponRepository };
