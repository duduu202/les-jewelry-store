import { Exclude } from 'class-transformer';
import { CartItems as ICart_items, Paid_status } from '@prisma/client';
import { PaymentCard } from '@modules/PaymentCard/models/PaymentCard';
import { Product } from '@modules/Product/models/Product';

class Cart_items implements ICart_items {
  id: string;

  cart_id: string;

  product_id: string;

  product: Product;

  quantity: number;

  created_at: Date;

  updated_at: Date;
}

export { Cart_items };
