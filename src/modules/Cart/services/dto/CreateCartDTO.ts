import { CartItems } from "@prisma/client";

interface ICreateCartDTO {
  request_id: string;
  cart_items: { product_id: string; quantity: number }[];
  cupom_code?: string;
}

export { ICreateCartDTO };
