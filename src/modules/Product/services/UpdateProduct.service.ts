import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { plainToInstance } from 'class-transformer';
import { IProductRepository } from '../repositories/ProductRepository.interface';
import { IUpdateProductDTO } from './dto/UpdateProductDTO';
import { Product } from '../entities/Product';

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute({
    id,
    request_id,
    ...productParams
  }: IUpdateProductDTO): Promise<Product> {
    const product = await this.productRepository.findBy({
      id: id,
    });

    if (!product) throw new AppError('Usuário não encontrado', 404);

    Object.assign(product, productParams);

    const newProduct = await this.productRepository.update(product);

    return plainToInstance(Product, newProduct);
  }
}

export { UpdateProductService };
