import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/error/AppError';
import { IHashProvider } from '@shared/container/providers/HashProvider/model/IHashProvider';
import { plainToInstance } from 'class-transformer';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { IProductRepository } from '../repositories/ProductRepository.interface';
import { ICreateProductDTO } from './dto/CreateProductDTO';
import { Product } from '../models/Product';

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    image,
    description,
    ...productParams
  }: ICreateProductDTO): Promise<Product> {
    let urlImage: string | undefined;
    if (image) {
      const filename = await this.storageProvider.saveFile(image);
      urlImage = `${process.env.API_URL}/files/${filename}`;
    }

    const product = await this.productRepository.create({
      description: description || '',
      image: urlImage,
      ...productParams,
    });

    return plainToInstance(Product, product);
  }
}

export { CreateProductService };
