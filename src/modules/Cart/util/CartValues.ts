import { Product } from '@modules/Product/entities/Product';
import { Cart_status, Coupon } from '@prisma/client';
import { Cart } from '../entities/Cart';
import { Cart_items } from '../entities/Cart_items';

interface ICartItemsQuantity {
  product: Product;
  quantity: number;
}

export function sumTotalPrice(
  cart: Cart,
  include_delivery = false,
  include_coupon = false,
): number {
  let total = 0;
  cart.cart_items.forEach(item => {
    total += item.product.price * item.quantity;
  });
  if (include_coupon) total -= cart.cupom?.discount || 0;
  if (include_delivery) {
    total += cart.delivery_fee;
  }

  return Math.round(total * 100) / 100;
}
export function getTotalDiscount(cart: Cart): number {
  let total = 0;
  total += cart.cupom?.discount || 0;

  return Math.round(total * 100) / 100;
}

export function getDeliveryFee(
  cart_items: ICartItemsQuantity[],
  cart_status?: Cart_status,
  coupon?: Coupon,
): number {
  let delivery_fee = 0;
  const percentage = process.env.FREIGHT_VALUE_PERCENTAGE
    ? parseFloat(process.env.FREIGHT_VALUE_PERCENTAGE)
    : 0;
  delivery_fee = cart_items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);
  delivery_fee -= coupon?.discount || 0;
  delivery_fee *= percentage / 100;
  delivery_fee = Math.round(delivery_fee * 100) / 100;
  if (cart_status === 'TROCA_AUTORIZADA' || cart_status === 'EM_TROCA') {
    delivery_fee = 0;
  }

  return delivery_fee;
}
