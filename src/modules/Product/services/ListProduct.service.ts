import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { plainToInstance } from 'class-transformer';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { IProductRepository } from '../repositories/ProductRepository.interface';
import { Product } from '../models/Product';

@injectable()
class ListProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute({
    filters,
    limit,
    page,
    include,
    search,
  }: IPaginatedRequest<Product>): Promise<IPaginatedResponse<Product>> {
    const product = await this.productRepository.listBy({
      filters,
      limit,
      page,
      include,
      search,
    });

    if (!product) throw new AppError('Endereço não encontrado', 404);

    return {
      page: product.page,
      limit: product.limit,
      results: plainToInstance(Product, product.results),
      total: product.total,
    };
  }
}

export { ListProductService };
