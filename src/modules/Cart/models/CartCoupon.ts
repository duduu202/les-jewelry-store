import { CartCoupon as ICartCoupon, Coupon } from '@prisma/client';
import { Cart } from './Cart';

class CartCoupon implements ICartCoupon {
  id: string;

  cart_id: string | null;

  cart: Cart | null;

  coupon_id: string | null;

  coupon: Coupon | null;

  created_at: Date;

  updated_at: Date;
}

export { CartCoupon };
