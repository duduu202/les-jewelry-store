import { Cart_items } from '@modules/Cart/models/Cart_items';
import { PaymentCard } from '@modules/PaymentCard/models/PaymentCard';
import { Product } from '@modules/Product/models/Product';
import {
  CartCoupon,
  CartItems,
  Cart_status,
  Paid_status,
} from '@prisma/client';

export interface ICartCreate {
  user_id: string;
  cart_items: { product: Product; quantity: number }[];
  expires_at?: Date;
  status?: Cart_status;
}

export interface ICartUpdate {
  delivery_fee?: number;
  charge_address_id: string | null;
  delivery_address_id: string | null;
  expires_at: Date | null;
  paid_status: Paid_status;
  id: string;
  user_id: string;
  cart_items: Cart_items[];
  cart_payment_cards: PaymentCard[];
  cart_coupons: CartCoupon[];
  status: Cart_status;
  created_at: Date;
  updated_at: Date;
}
