import { Exclude } from 'class-transformer';
import { Product as IProduct } from '@prisma/client';
import { Cart_items } from '@modules/Cart/entities/Cart_items';

class Product implements IProduct {
  id: string;

  price: number;

  stock: number;

  stock_available: number;

  name: string;

  image: string | null;

  description: string;

  created_at: Date;

  updated_at: Date;

  cart_items: Cart_items;
}

export { Product };
