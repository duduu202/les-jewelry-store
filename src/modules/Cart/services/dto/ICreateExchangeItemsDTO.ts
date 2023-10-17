import { CartItems } from '@prisma/client';

interface ICreateExchangeItemsDTO {
  request_id: string;

  cart_id: string;
  cart_items: { product_id: string; quantity: number }[];
}

export { ICreateExchangeItemsDTO };
