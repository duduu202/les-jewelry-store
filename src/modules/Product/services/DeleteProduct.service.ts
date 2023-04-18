import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { IProductRepository } from '../repositories/ProductRepository.interface';
import { IDeleteProductDTO } from './dto/DeleteProductDTO';

@injectable()
class DeleteProductService {
  constructor(
    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute({ id, request_id }: IDeleteProductDTO): Promise<void> {
    const product = await this.productRepository.findBy({
      id,
    });

    if (!product) throw new AppError('Produto não encontrado', 404);

    await this.productRepository.remove(product);
  }
}

export { DeleteProductService };
