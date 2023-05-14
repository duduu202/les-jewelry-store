import { Exclude } from 'class-transformer';
import { Cart as ICart, CartItems, Cart_status, Paid_status } from '@prisma/client';
import { PaymentCard } from '@modules/PaymentCard/entities/PaymentCard';

class Cart implements ICart {
  address_id: string | null;
  expires_at: Date;
  cupom_id: string | null;
  paid_status: Paid_status;
  id: string;
  user_id: string;
  cart_items: CartItems[];
  cart_payment_cards: PaymentCard[];
  status: Cart_status;
  created_at: Date;
  updated_at: Date;
}

export { Cart };
