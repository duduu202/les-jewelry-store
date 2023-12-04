import { Product, Paid_status } from '@prisma/client/edge';
import { prisma } from '@shared/database';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { Cart } from '@modules/Cart/models/Cart';
import { prisma_cache_time } from '@config/prismaCacheTime';
import { IProductCreate, IProductUpdate } from './dto/ProductRepositoryDTO';
import { IProductRepository } from './ProductRepository.interface';
import { Product as EntityProduct } from '../models/Product';

class ProductRepository implements IProductRepository {
  async findBy(
    filter: Partial<Product>,
    // include?: { [key: string]: boolean },
  ): Promise<EntityProduct | null> {
    const product = (await prisma.product.findFirst({
      where: { ...filter },
      include: {
        categories: true,
      },
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
      // cacheStrategy: { ...prisma_cache_time },
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
    page = undefined,
    limit = undefined,
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
      include: {
        categories: true,
        cart_items: {
          include: {
            cart: true,
          },
        },
      },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit,
      // cacheStrategy: { ...prisma_cache_time },
    });

    const productTotal = prisma.product.count({
      where: filters && {
        ...filters,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      // cacheStrategy: { ...prisma_cache_time },
    });

    // stock means the total of products in stock
    // stock_available means the total of products in stock that are available to sell, not reserved
    // because a cart can reserve a product, but the product is still in stock

    const productsWithStock = products.map(product => {
      // const productsFil = await prisma.product.findMany({
      //  include: {
      //    cart_items: {
      //      include: {
      //        cart: true,
      //      },
      //    },
      //  },
      //  where: {
      //    id: product.id,
      //  },
      // });

      // const countNotPaid = productsFil.reduce((acc, prd) => {
      //  if (prd.cart_items.length === 0) return acc;
      //  const notPaid = prd.cart_items.filter(
      //    item => item.cart.paid_status !== Paid_status.PAID,
      //  );
      //
      //  return acc + notPaid.reduce((acc2, item) => acc2 + item.quantity, 0);
      // }, 0);

      const countNotPaid = product.cart_items.reduce((acc, item) => {
        if (item.cart.paid_status === Paid_status.PAID) return acc;
        return acc + item.quantity;
      }, 0);

      return {
        ...product,
        stock: product.stock,
        stock_available: product.stock - countNotPaid,
      };
    });

    return {
      results: productsWithStock as EntityProduct[],
      total: await productTotal,
      page,
      limit,
    };
  }

  async create({ ...datas }: IProductCreate): Promise<Product> {
    console.log('datas', datas);
    const product = await prisma.product.create({
      data: {
        ...datas,
        categories: {
          connectOrCreate: datas.categories?.map(category => ({
            where: { name: category },
            create: { name: category },
          })),
        },
      },
    });
    return product;
  }

  async update({ id, categories, ...datas }: IProductUpdate): Promise<Product> {
    const product = await this.findBy({ id });
    // disconnect all categories
    if (categories && product && product.categories) {
      await prisma.product.update({
        where: { id },
        data: {
          categories: {
            disconnect: product.categories.map(category => ({
              name: category.name,
            })),
          },
        },
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...datas,
        categories: {
          connectOrCreate: categories?.map(category => ({
            where: { name: category },
            create: { name: category },
          })),
        },
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
