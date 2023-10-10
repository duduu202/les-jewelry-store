import { Product, Paid_status } from '@prisma/client';
import { prisma } from '@shared/database';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { Cart } from '@modules/Cart/entities/Cart';
import { IProductCreate } from './dto/ProductRepositoryDTO';
import { IProductRepository } from './ProductRepository.interface';
import { Product as EntityProduct } from '../entities/Product';

class ProductRepository implements IProductRepository {
  async findBy(
    filter: Partial<Product>,
    // include?: { [key: string]: boolean },
  ): Promise<EntityProduct | null> {
    const product = (await prisma.product.findFirst({
      where: { ...filter },
    })) as EntityProduct;
    if (!product) return null;

    const productsFil = await prisma.product.findMany({
      include: {
        cart_items: {
          include: {
            cart: true,
          },
        },
      },
    });

    const countNotPaid = productsFil.reduce((acc, prd) => {
      if (prd.cart_items.length === 0) return acc;
      const notPaid = prd.cart_items.filter(
        item => item.cart.paid_status !== 'PAID',
      );

      return acc + notPaid.reduce((acc2, item) => acc2 + item.quantity, 0);
    }, 0);

    product.stock_available = product.stock - countNotPaid;

    return product as EntityProduct;
  }

  public async listBy({
    page = 1,
    limit = 10,
    filters,
    search,
  }: IPaginatedRequest<Product>): Promise<IPaginatedResponse<EntityProduct>> {
    const products = await prisma.product.findMany({
      where: filters && {
        ...filters,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const productTotal = await prisma.product.count({
      where: filters && {
        ...filters,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    });

    // stock means the total of products in stock
    // stock_available means the total of products in stock that are available to sell, not reserved
    // because a cart can reserve a product, but the product is still in stock

    const productsWithStock = await Promise.all(
      products.map(async product => {
        const productsFil = await prisma.product.findMany({
          include: {
            cart_items: {
              include: {
                cart: true,
              },
            },
          },
        });

        const countNotPaid = productsFil.reduce((acc, prd) => {
          if (prd.cart_items.length === 0) return acc;
          const notPaid = prd.cart_items.filter(
            item => item.cart.paid_status !== 'PAID',
          );

          return acc + notPaid.reduce((acc2, item) => acc2 + item.quantity, 0);
        }, 0);

        return {
          ...product,
          stock: product.stock,
          stock_available: product.stock - countNotPaid,
        };
      }),
    );

    return {
      results: productsWithStock as EntityProduct[],
      total: productTotal,
      page,
      limit,
    };
  }

  async create({ ...datas }: IProductCreate): Promise<Product> {
    console.log('datas', datas);
    const product = await prisma.product.create({
      data: {
        ...datas,
      },
    });
    return product;
  }

  async update({ id, ...datas }: Product): Promise<Product> {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...datas,
      },
    });

    return updatedProduct;
  }

  async remove(product: Product): Promise<void> {
    await prisma.product.delete({
      where: { id: product.id },
    });
  }
}

export { ProductRepository };
