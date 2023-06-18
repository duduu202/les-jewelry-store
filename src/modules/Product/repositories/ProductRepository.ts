import { Product, Paid_status } from '@prisma/client';
import { prisma } from '@shared/database';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { IProductCreate } from './dto/ProductRepositoryDTO';
import { IProductRepository } from './ProductRepository.interface';
import { Product as EntityProduct } from '../entities/Product';

class ProductRepository implements IProductRepository {
  async findBy(
    filter: Partial<Product>,
    //include?: { [key: string]: boolean },
  ): Promise<EntityProduct | null> {
    const product = await prisma.product.findFirst({
      where: { ...filter },
    });
    if (!product) return null;

    const notPaidCount = await prisma.cart.count({
      where: {
        cart_items: {
          some: {
            product_id: product.id,
            cart: {
              paid_status: {
                // not paid and not EXPIRED
                // not: 'PAID', and not: 'EXPIRED'
                notIn: ['PAID', 'EXPIRED'],
              },
            },
          },
        },
      },
    });

    Object.assign(product, {
      stock_available: product.stock - notPaidCount,
    });

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
        const notPaidCount = await prisma.cart.count({
          where: {
            cart_items: {
              some: {
                product_id: product.id,
                cart: {
                  paid_status: {
                    not: 'PAID',
                  },
                },
              },
            },
          },
        });

        return {
          ...product,
          stock: product.stock,
          stock_available: product.stock - notPaidCount,
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
