import { IProductRepository } from '@modules/Product/repositories/ProductRepository.interface';
import { Cart_status } from '@prisma/client';
import { AppError } from '@shared/error/AppError';
import { plainToInstance } from 'class-transformer';
import { inject, injectable } from 'tsyringe';
import { Cart } from '../entities/Cart';
import { Cart_items } from '../entities/Cart_items';
import { ICartRepository } from '../repositories/CartRepository.interface';
import { ICreateExchangeItemsDTO } from './dto/ICreateExchangeItemsDTO';

@injectable()
class CreateExchangeItemsService {
  // never expire
  time_available_in_minutes = 60 * 24 * 365 * 100;
  constructor(
    @inject('CartRepository')
    private cartRepository: ICartRepository,

    @inject('ProductRepository')
    private productRepository: IProductRepository, //time_available_in_minutes = 30,
  ) {
    //this.time_available_in_minutes = time_available_in_minutes;
  }

  public async execute({
    ...cartParams
  }: ICreateExchangeItemsDTO): Promise<Cart> {
    const { cart_id, cart_items, request_id } = cartParams;

    const cart = await this.cartRepository.findBy({ id: cart_id });
    if (!cart) throw new AppError('Carrinho não encontrado', 404);

    if (cart_items.length === 0) throw new AppError('Carrinho vazio', 400);

    const exchangedItems = await Promise.all(
      cart_items.map(async item => {
        const product = await this.productRepository.findBy({
          id: item.product_id,
        });
        const productInCart = cart.cart_items.find(
          cartItem => cartItem.product_id === item.product_id,
        );
        if (!product || !productInCart)
          throw new AppError('Produto não encontrado', 404);

        if (productInCart?.quantity < item.quantity)
          throw new AppError('Quantidade indisponível', 400);

        productInCart.quantity -= item.quantity;

        return { product, quantity: item.quantity };
      }),
    );

    //const itemsNotExchanged = cart.cart_items.filter(
    //  cartItem =>
    //    !exchangedItems.find(item => item.product.id === cartItem.product_id),
    //);

    const exchangeCart = await this.cartRepository.create({
      user_id: request_id,
      expires_at: new Date(Date.now() + this.time_available_in_minutes * 60000),
      cart_items: exchangedItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
      status: Cart_status.EM_TROCA,
    });

    // remove those items from the original cart
    await this.cartRepository.update({
      id: cart_id,
      address_id: cart.address_id,
      expires_at: new Date(cart.expires_at),
      cart_payment_cards: cart.cart_payment_cards,
      paid_status: cart.paid_status,
      status: cart.status,
      user_id: cart.user_id,
      created_at: cart.created_at,
      cupom_id: null,
      updated_at: cart.updated_at,
      cart_items: cart.cart_items,
    });

    return plainToInstance(Cart, exchangeCart);
  }
}

export { CreateExchangeItemsService };
