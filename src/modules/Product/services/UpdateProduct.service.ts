import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { plainToInstance } from 'class-transformer';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { IProductRepository } from '../repositories/ProductRepository.interface';
import { IUpdateProductDTO } from './dto/UpdateProductDTO';
import { Product } from '../models/Product';

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
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

    if (productParams.image) {
      if (product.image) {
        await this.storageProvider.deleteFile(product.image);
      }
      const filename = await this.storageProvider.saveFile(productParams.image);
      productParams.image = `${process.env.API_URL}/files/${filename}`;
    }

    Object.assign(product, productParams);

    const newProduct = await this.productRepository.update({
      description: product.description,
      id: product.id,
      image: product.image ? product.image : undefined,
      name: product.name,
      price: product.price,
      stock: product.stock,
      categories: product.categories
        ? product.categories.map(category => category.name)
        : [],
    });

    return plainToInstance(Product, newProduct);
  }
}

export { UpdateProductService };
