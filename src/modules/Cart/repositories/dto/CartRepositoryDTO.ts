import { CartItems, Cart_status } from '@prisma/client';

export interface ICartCreate {
  user_id: string;
  cart_items: { product_id: string; quantity: number }[];
  cupom_code?: string;
  expires_at?: Date;
  status?: Cart_status;
}
