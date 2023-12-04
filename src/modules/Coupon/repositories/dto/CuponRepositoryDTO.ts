import { Coupon_type } from '@prisma/client';

export interface ICouponCreate {
  user_id?: string;
  code: string;
  expires_at?: Date;
  discount: number;
  type?: Coupon_type;
  quantity: number;
}
