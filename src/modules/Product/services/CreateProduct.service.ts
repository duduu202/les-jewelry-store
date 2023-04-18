import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/error/AppError';
import { IHashProvider } from '@shared/container/providers/HashProvider/model/IHashProvider';
import { plainToInstance } from 'class-transformer';
import { IProductRepository } from '../repositories/ProductRepository.interface';
import { ICreateProductDTO } from './dto/CreateProductDTO';
import { Product } from '../entities/Product';

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ description, ...productParams }: ICreateProductDTO): Promise<Product> {
    const product = await this.productRepository.create({
      description: description || '',
      ...productParams,
    });

    return plainToInstance(Product, product);
  }
}

export { CreateProductService };
