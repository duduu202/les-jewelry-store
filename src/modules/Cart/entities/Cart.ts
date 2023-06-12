import { Exclude } from 'class-transformer';
import { Cart as ICart, Cart_status, Paid_status } from '@prisma/client';
import { PaymentCard } from '@modules/PaymentCard/entities/PaymentCard';
import { Cart_items } from './Cart_items';

class Cart implements ICart {
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

export { Cart };
