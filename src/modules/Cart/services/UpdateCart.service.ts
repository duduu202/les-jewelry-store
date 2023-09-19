import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { plainToInstance } from 'class-transformer';
import { IProductRepository } from '@modules/Product/repositories/ProductRepository.interface';
import { v4 } from 'uuid';
import { ICartRepository } from '../repositories/CartRepository.interface';
import { IUpdateCartDTO } from './dto/UpdateCartDTO';
import { Cart } from '../entities/Cart';

@injectable()
class UpdateCartService {
  time_available_in_minutes = 60 * 12;

  constructor(
    @inject('CartRepository')
    private cartRepository: ICartRepository,

    @inject('ProductRepository')
    private productRepository: IProductRepository,
  ) {}

  public async execute({
    id,
    request_id,
    cart_items,
    ...cartParams
  }: IUpdateCartDTO): Promise<Cart> {
    const cart = await this.cartRepository.findBy({
      id,
      user_id: request_id,
    });

    if (!cart) throw new AppError('Usuário não encontrado', 404);

    if (cart_items.length === 0) throw new AppError('Carrinho vazio', 400);

    const items = await Promise.all(
      cart_items.map(async item => {
        const product = await this.productRepository.findBy({
          id: item.product_id,
        });
        if (!product) throw new AppError('Produto não encontrado', 404);
        if (product.stock_available < item.quantity)
          throw new AppError('Quantidade indisponível', 400);
        return { product, quantity: item.quantity };
      }),
    );

    const uptated_cart = await this.cartRepository.update({
      user_id: request_id,
      cart_items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        cart_id: id,
        created_at: new Date(),
        updated_at: new Date(),
        product_id: item.product.id,
        id: v4(),
      })),
      expires_at: new Date(Date.now() + this.time_available_in_minutes * 60000),
      address_id: null,
      cupom_id: null,
      paid_status: cart.paid_status,
      status: cart.status,
      id,
      cart_payment_cards: [],
      created_at: cart.created_at,
      updated_at: new Date(),
    });
    return plainToInstance(Cart, uptated_cart);
  }
}

export { UpdateCartService };
