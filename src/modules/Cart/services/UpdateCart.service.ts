import { AppError } from '@shared/error/AppError';
import { container, inject, injectable } from 'tsyringe';

import { plainToInstance } from 'class-transformer';
import { IProductRepository } from '@modules/Product/repositories/ProductRepository.interface';
import { v4 } from 'uuid';
import { Product } from '@modules/Product/models/Product';
import { ICartRepository } from '../repositories/CartRepository.interface';
import { IUpdateCartDTO } from './dto/UpdateCartDTO';
import { Cart } from '../models/Cart';
import { getDeliveryFee } from '../util/CartValues';
import { GetCurrentCartService } from './GetCurrentCart.service';

@injectable()
class UpdateCartService {
  time_available_in_minutes = 60 * 12;

  constructor(
    @inject('CartRepository')
    private cartRepository: ICartRepository,

    @inject('ProductRepository')
    private productRepository: IProductRepository,

    private getCurrentCartService: GetCurrentCartService = container.resolve(
      GetCurrentCartService,
    ),
  ) {}

  public async execute({
    id,
    request_id,
    cart_items,
    ...cartParams
  }: IUpdateCartDTO): Promise<Cart> {
    const cart = id
      ? this.getCurrentCartService.execute({ request_id })
      : await this.cartRepository.findBy({
          id,
          user_id: request_id,
        });

    if (!cart) throw new AppError('Carrinho não encontrado', 404);

    // if (cart_items.length === 0) throw new AppError('Carrinho vazio', 400);

    const foundItems = await Promise.all(
      cart_items.map(async item => {
        if (item.quantity <= 0) {
          return null;
        }
        const product = await this.productRepository.findBy({
          id: item.product_id,
        });
        if (!product) throw new AppError('Produto não encontrado', 404);
        if (product.stock <= item.quantity)
          throw new AppError('Quantidade indisponível', 400);
        return { product, quantity: item.quantity };
      }),
    );

    const items = foundItems.filter(item => item !== null) as {
      product: Product;
      quantity: number;
    }[];

    const uptated_cart = await this.cartRepository.update({
      user_id: request_id,
      cart_items:
        items?.map(item => ({
          product: item!.product,
          quantity: item!.quantity,
          cart_id: id,
          created_at: new Date(),
          updated_at: new Date(),
          product_id: item!.product.id,
          id: v4(),
        })) || [],
      expires_at: new Date(Date.now() + this.time_available_in_minutes * 60000),
      address_id: null,
      paid_status: cart.paid_status,
      status: cart.status,
      cart_coupons: [],
      delivery_fee: items
        ? getDeliveryFee(
            items.map(i => {
              return {
                product: i.product,
                quantity: i.quantity,
              };
            }),
          )
        : 0,
      id,
      cart_payment_cards: [],
      created_at: cart.created_at,
      updated_at: new Date(),
    });
    return plainToInstance(Cart, uptated_cart);
  }
}

export { UpdateCartService };
