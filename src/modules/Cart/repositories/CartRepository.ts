import { Cart } from '@prisma/client';
import { prisma } from '@shared/database';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { ICartCreate } from './dto/CartRepositoryDTO';
import { ICartRepository } from './CartRepository.interface';
import { Cart as EntityCart } from '../entities/Cart';

class CartRepository implements ICartRepository {
  async findBy(
    filter: Partial<Cart>,
    //include?: { [key: string]: boolean },
  ): Promise<EntityCart | null> {
    const cart = await prisma.cart.findFirst({
      where: { ...filter },
      include: {
        cart_items: {
          include: {
            product: true,
          }
        },
      },
    });

    return cart as EntityCart;
  }

  public async listBy({
    page = 1,
    limit = 10,
    filters,
    //search,
  }: IPaginatedRequest<Cart>): Promise<IPaginatedResponse<EntityCart>> {
    const cartes = await prisma.cart.findMany({
      where: filters && {
        ...filters,
        //name: {
        //  contains: search,
        //  mode: 'insensitive',
        //},
      },
      include: {
        cart_items: {
          include: {
            product: true,
          }
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const cartTotal = await prisma.cart.count({
      where: filters && {
        ...filters,
        //name: {
        //  contains: search,
        //  mode: 'insensitive',
        //},
      },
    });

    return {
      results: cartes as EntityCart[],
      total: cartTotal,
      page,
      limit,
    };
  }

  async create({ cart_items, ...datas }: ICartCreate): Promise<Cart> {
    const cart = await prisma.cart.create({
      data: {
        ...datas,
        cart_items: {
          create: cart_items,
        }
      },
    });
    return cart;
  }

  async update({ id, ...datas }: EntityCart): Promise<Cart> {
    const cart_items = datas.cart_items.map((item) => {
      return {
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
      }
    });
    
    await prisma.cartPaymentCard.deleteMany({
      where: {
        cart_id: id,
      },
    });
    await prisma.cartItems.deleteMany({
      where: {
        cart_id: id,
      },
    });

    const updatedCart = await prisma.cart.update({
      where: { id },
      data: {
        paid_status: datas.paid_status,
        address_id: datas.address_id,
        created_at: datas.created_at,
        cupom_id: datas.cupom_id,
        expires_at: datas.expires_at,
        status: datas.status,
        updated_at: datas.updated_at,
        cart_payment_cards: {
          create: datas.cart_payment_cards,
        },
        cart_items: {
          create: cart_items
        },
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
