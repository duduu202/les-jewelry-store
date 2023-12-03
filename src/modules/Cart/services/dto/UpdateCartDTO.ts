import { CartItems } from '@prisma/client';

interface IUpdateCartDTO {
  id?: string;
  request_id: string;
  cart_items: { product_id: string; quantity: number }[];
}

export { IUpdateCartDTO };
