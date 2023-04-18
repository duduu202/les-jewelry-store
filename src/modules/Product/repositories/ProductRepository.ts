import { Product } from '@prisma/client';
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
    const product = await prisma.product.findFirstOrThrow({
      where: { ...filter },
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

    return {
      results: products as EntityProduct[],
      total: productTotal,
      page,
      limit,
    };
  }

  async create({...datas }: IProductCreate): Promise<Product> {
    console.log("datas", datas);
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
