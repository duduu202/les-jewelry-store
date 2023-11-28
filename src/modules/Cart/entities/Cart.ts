import { Exclude } from 'class-transformer';
import {
  Cart as ICart,
  Coupon,
  Cart_status,
  Paid_status,
} from '@prisma/client';
import { PaymentCard } from '@modules/PaymentCard/entities/PaymentCard';
import { Cart_items } from './Cart_items';
import { CartCoupon } from './CartCoupon';

class Cart implements ICart {
  is_default: boolean;

  address_id: string | null;

  expires_at: Date | null;

  is_current: boolean;

  paid_status: Paid_status;

  id: string;

  user_id: string;

  status: Cart_status;

  created_at: Date;

  updated_at: Date;

  delivery_fee: number;

  discount: number;

  products_price: number;

  total_price: number;

  cart_items: Cart_items[];

  cart_payment_cards: PaymentCard[];

  cart_coupons: CartCoupon[];
}

export { Cart };
