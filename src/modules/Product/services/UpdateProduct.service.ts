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
      id,
    });

    if (!product) throw new AppError('Produto não encontrado', 404);

    Object.assign(product, productParams);

    const newProduct = await this.productRepository.update({
      created_at: product.created_at,
      updated_at: product.updated_at,
      description: product.description,
      id: product.id,
      image: product.image,
      name: product.name,
      price: product.price,
      stock: product.stock,
      categories: product.categories,
    });

    return plainToInstance(Product, newProduct);
  }
}

export { UpdateProductService };
