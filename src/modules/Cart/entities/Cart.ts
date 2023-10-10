import { Exclude } from 'class-transformer';
import {
  Cart as ICart,
  Coupon,
  Cart_status,
  Paid_status,
  CartCoupon,
} from '@prisma/client';
import { PaymentCard } from '@modules/PaymentCard/entities/PaymentCard';
import { Cart_items } from './Cart_items';

class Cart implements ICart {
  address_id: string | null;

  expires_at: Date | null;

  is_current: boolean;

  cupom: Coupon;

  paid_status: Paid_status;

  id: string;

  user_id: string;

  cart_items: Cart_items[];

  cart_payment_cards: PaymentCard[];

  cart_coupons: CartCoupon[];

  status: Cart_status;

  created_at: Date;

  updated_at: Date;

  delivery_fee: number;

  discount: number;

  products_price: number;

  total_price: number;
}

export { Cart };
