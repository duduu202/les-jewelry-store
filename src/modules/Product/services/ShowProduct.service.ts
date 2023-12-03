import { AppError } from '@shared/error/AppError';
import { plainToInstance } from 'class-transformer';
import { inject, injectable } from 'tsyringe';
import { Product } from '../models/Product';
import { IProductRepository } from '../repositories/ProductRepository.interface';
import { IShowProductDTO } from './dto/ShowProductDTO';

@injectable()
class ShowProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute({ id, request_id }: IShowProductDTO): Promise<Product> {
    const product = await this.productRepository.findBy({
      id,
    });

    if (!product) throw new AppError('Prduto não encontrado', 404);

    return plainToInstance(Product, product);
  }
}

export { ShowProductService };
