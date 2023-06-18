import { Cart_items } from '@modules/Cart/entities/Cart_items';
import { PaymentCard } from '@modules/PaymentCard/entities/PaymentCard';
import { Product } from '@modules/Product/entities/Product';
import { CartItems, Cart_status, Paid_status } from '@prisma/client';

export interface ICartCreate {
  user_id: string;
  cart_items: { product: Product; quantity: number }[];
  cupom_code?: string;
  expires_at?: Date;
  status?: Cart_status;
}

export interface ICartUpdate {
  delivery_fee?: number;
  address_id: string | null;
  expires_at: Date | null;
  cupom_id: string | null;
  paid_status: Paid_status;
  id: string;
  user_id: string;
  cart_items: Cart_items[];
  cart_payment_cards: PaymentCard[];
  status: Cart_status;
  created_at: Date;
  updated_at: Date;
}
