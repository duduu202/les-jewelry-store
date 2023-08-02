import { CartItems } from '@prisma/client';

interface IPayCartDTO {
  cart_id: string;
  request_id: string;
  coupon_codes?: string[];
  address_id: string;
  payment_cards: { card_id: string; percentage: number }[];
}

export { IPayCartDTO };
