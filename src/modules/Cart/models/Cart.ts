import { Prisma, Paid_status, Cart_status } from '@prisma/client';
import { PaymentCard } from '@modules/PaymentCard/models/PaymentCard';
import { Address } from '@modules/Address/models/Address';
import { Cart_items } from './Cart_items';
import { CartCoupon } from './CartCoupon';

type ICart = Prisma.CartGetPayload<{
  include: {
    charge_address: true;
    delivery_address: true;
    cart_items: {
      include: {
        product: true;
      };
    };
    // cart_payment_cards: {
    //   include: {
    //     payment_card: true;
    //   };
    // };
    cart_coupons: {
      include: {
        coupon: true;
      };
    };
  };
}>;

class Cart implements ICart {
  charge_address: Address | null;

  delivery_address: Address | null;

  charge_address_id: string | null;

  delivery_address_id: string | null;

  is_default: boolean;

  address_id: string | null;

  expires_at: Date | null;

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
