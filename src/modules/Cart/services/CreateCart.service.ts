import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/error/AppError';
import { IHashProvider } from '@shared/container/providers/HashProvider/model/IHashProvider';
import { plainToInstance } from 'class-transformer';
import { ICartRepository } from '../repositories/CartRepository.interface';
import { ICreateCartDTO } from './dto/CreateCartDTO';
import { IProductRepository } from '@modules/Product/repositories/ProductRepository.interface';
import { Cart } from '../entities/Cart';

@injectable()
class CreateCartService {
  time_available_in_minutes = 60 * 12;
  constructor(
    @inject('CartRepository')
    private cartRepository: ICartRepository,

    @inject('ProductRepository')
    private productRepository: IProductRepository,

    //time_available_in_minutes = 30,
  ) {
    //this.time_available_in_minutes = time_available_in_minutes;
  }

  public async execute({ ...cartParams }: ICreateCartDTO): Promise<Cart> {
    console.log(cartParams.request_id);
    const { cupom_code, cart_items } = cartParams;

    if(cart_items.length === 0) throw new AppError('Carrinho vazio', 400);

    const items = await Promise.all(
      cart_items.map(async (item) => {
        const product = await this.productRepository.findBy({
          id: item.product_id,
        });
        if(!product) throw new AppError('Produto não encontrado', 404);
        if(product.stock_available < item.quantity) throw new AppError('Quantidade indisponível', 400);
        return { product, quantity: item.quantity };
      }),
    );

    const cart = await this.cartRepository.create({
      user_id: cartParams.request_id,
      cart_items: items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
      cupom_code,
      expires_at: new Date(Date.now() + this.time_available_in_minutes * 60000),
    });

    return plainToInstance(Cart, cart);
  }
}

export { CreateCartService };
