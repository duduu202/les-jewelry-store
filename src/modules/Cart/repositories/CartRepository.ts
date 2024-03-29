import { Cart, Cart_status } from '@prisma/client';
import { prisma } from '@shared/database';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { prisma_cache_time } from '@config/prismaCacheTime';
import { ICartCreate, ICartUpdate } from './dto/CartRepositoryDTO';
import { ICartRepository, ICustomFilters } from './CartRepository.interface';
import { Cart as EntityCart } from '../models/Cart';
import {
  getDeliveryFee,
  getTotalDiscount,
  sumTotalPrice,
} from '../util/CartValues';

class CartRepository implements ICartRepository {
  async findBy(
    filter: Partial<Cart>,
    // include?: { [key: string]: boolean },
  ): Promise<EntityCart | null> {
    const cart = await prisma.cart.findFirst({
      where: { ...filter },
      include: {
        // cart_coupons: true,
        cart_coupons: {
          include: {
            coupon: true,
          },
        },
        cart_items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!cart) return null;

    return {
      ...cart,
      products_price: sumTotalPrice(cart as EntityCart),
      discount: getTotalDiscount(cart as EntityCart),
      total_price: sumTotalPrice(cart as EntityCart, true, true),
    } as EntityCart;
  }

  public async listBy({
    page = 1,
    limit,
    filters,
    customFilters,
  }: IPaginatedRequest<Cart, ICustomFilters>): Promise<
    IPaginatedResponse<EntityCart>
  > {
    const carts = await prisma.cart.findMany({
      where: filters && {
        ...filters,
        updated_at:
          customFilters?.start_date && customFilters?.end_date
            ? {
                gte: customFilters?.start_date,
                lte: customFilters?.end_date,
              }
            : undefined,
      },
      include: {
        cart_coupons: {
          include: {
            coupon: true,
          },
        },
        cart_items: {
          include: {
            product: {
              include: {
                categories: true,
              },
            },
          },
        },
      },
      orderBy: {
        updated_at: 'desc',
      },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit,
      // cacheStrategy: { ...prisma_cache_time },
    });

    const cartTotal = await prisma.cart.count({
      where: filters && {
        ...filters,
      },
    });

    const cartsEntity = carts.map(cart => {
      return {
        ...cart,
        products_price: sumTotalPrice(cart as EntityCart),
        discount: getTotalDiscount(cart as EntityCart),
        total_price: sumTotalPrice(cart as EntityCart, true, true),
      };
    }) as EntityCart[];

    return {
      results: cartsEntity as EntityCart[],
      total: cartTotal,
      page,
      limit,
    };
  }

  async create({ cart_items, ...datas }: ICartCreate): Promise<Cart> {
    const cart_items_data = cart_items.map(item => {
      return {
        product_id: item.product.id,
        quantity: item.quantity,
      };
    });

    const delivery_fee = getDeliveryFee(cart_items, datas.status);
    const cart = await prisma.cart.create({
      data: {
        ...datas,
        cart_items: {
          create: cart_items_data,
        },
        delivery_fee,
      },
    });

    return cart;
  }

  async update({ id, ...datas }: ICartUpdate): Promise<EntityCart> {
    const cart_items = datas.cart_items.map(item => {
      return {
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
      };
    });

    if (datas.cart_payment_cards) {
      await prisma.cartPaymentCard.deleteMany({
        where: {
          cart_id: id,
        },
      });
    }

    if (datas.cart_items) {
      await prisma.cartItems.deleteMany({
        where: {
          cart_id: id,
        },
      });
    }

    if (datas.cart_coupons) {
      await prisma.cartCoupon.deleteMany({
        where: {
          cart_id: id,
        },
      });
    }
    // remove duplicated products
    const cart_items_filtered = cart_items.filter(
      (item, index, self) =>
        index === self.findIndex(t => t.product_id === item.product_id),
    );

    const delivery_fee = getDeliveryFee(datas.cart_items, datas.status);
    const updatedCart = await prisma.cart.update({
      where: { id },
      data: {
        delivery_fee,
        paid_status: datas.paid_status,
        charge_address_id: datas.charge_address_id,
        delivery_address_id: datas.delivery_address_id,
        created_at: datas.created_at,
        expires_at: datas.expires_at,
        status: datas.status,
        updated_at: datas.updated_at,
        cart_payment_cards: datas.cart_payment_cards
          ? {
              create: datas.cart_payment_cards,
            }
          : undefined,
        cart_items: cart_items_filtered
          ? {
              create: cart_items_filtered,
            }
          : undefined,
        cart_coupons: datas.cart_coupons
          ? {
              create: datas.cart_coupons,
            }
          : undefined,
      },
    });

    return updatedCart as EntityCart;
  }

  async updateStatus({ id, ...datas }: ICartUpdate): Promise<EntityCart> {
    const updatedCart = await prisma.cart.update({
      where: { id },
      data: {
        status: datas.status,
      },
    });

    return updatedCart;
  }

  async remove(cart: Cart): Promise<void> {
    await prisma.cart.delete({
      where: { id: cart.id },
    });
  }
}

export { CartRepository };
