import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/error/AppError';
import { IHashProvider } from '@shared/container/providers/HashProvider/model/IHashProvider';
import { plainToInstance } from 'class-transformer';
import { ICartRepository } from '../repositories/CartRepository.interface';
import { IProductRepository } from '@modules/Product/repositories/ProductRepository.interface';
import { Cart } from '../entities/Cart';
import { IPayCartDTO } from './dto/PayCartDTO copy';
import {
  Cart_status,
  Paid_status,
  Coupon,
  Coupon_type,
  Address,
} from '@prisma/client';
import { ICouponRepository } from '@modules/Coupon/repositories/CouponRepository.interface';
import { IPaymentCardRepository } from '@modules/PaymentCard/repositories/PaymentCardRepository.interface';
import { Product } from '@modules/Product/entities/Product';
import { PaymentCard } from '@modules/PaymentCard/entities/PaymentCard';
import { IAddressRepository } from '@modules/Address/repositories/AddressRepository.interface';
import { sumTotalPrice } from '../util/CartValues';

interface ConfirmPayment {
  cart: Cart;
  validated_cards: { payment_card: PaymentCard; percentage: number }[];
  products: { product: Product; quantity: number }[];
  cupom_id?: string;
  coupon?: Coupon[];
  address: Address;
}
@injectable()
class PayCartService {
  constructor(
    @inject('CartRepository')
    private cartRepository: ICartRepository,

    @inject('ProductRepository')
    private productRepository: IProductRepository,

    @inject('CouponRepository')
    private couponRepository: ICouponRepository,

    @inject('PaymentCardRepository')
    private paymentCardRepository: IPaymentCardRepository,

    @inject('AddressRepository')
    private addressRepository: IAddressRepository,
  ) {
    //this.time_available_in_minutes = time_available_in_minutes;
  }

  public async execute({ ...cartParams }: IPayCartDTO): Promise<Cart> {
    console.log(cartParams.request_id);
    const { payment_cards, coupon_codes, request_id, cart_id } = cartParams;

    const cart = await this.cartRepository.findBy({
      id: cart_id,
      user_id: request_id,
    });
    if (!cart) throw new AppError('Carrinho não encontrado', 404);
    console.log('cart');
    console.dir(cart, { depth: 10 });
    await this.checkCart(cart);

    const address = await this.addressRepository.findBy({
      id: cartParams.address_id,
      user_id: request_id,
    });
    if (!address) throw new AppError('Endereço não encontrado', 404);

    const products = await this.checkProducts(cart);
    let coupon: Coupon[] | undefined = undefined;

    if (coupon_codes) {
      coupon = await this.checkCupom(
        coupon_codes,
        request_id,
        sumTotalPrice(cart, true),
      );
    }
    console.log('payment_cards');
    console.log(payment_cards);
    const validated_cards = await this.checkPaymentCardSplit(
      payment_cards,
      sumTotalPrice(cart, true, true),
    );

    const updated_cart = await this.confirmPayment({
      address,
      cart,
      products,
      validated_cards,
      coupon,
      cupom_id: coupon_codes ? coupon_codes[0] : undefined,
    });
    return plainToInstance(Cart, updated_cart);
  }

  private async checkCart(cart: Cart): Promise<void> {
    if (cart.expires_at && new Date(cart.expires_at) < new Date()) {
      cart.status = Cart_status.REPROVADA;
      cart.paid_status = Paid_status.EXPIRED;
      throw new AppError('Carrinho expirado', 400);
    }
    if (cart.paid_status == Paid_status.PAID) {
      throw new AppError('Carrinho já pago', 400);
    }
    if (cart.paid_status == Paid_status.REFUNDED) {
      throw new AppError('Carrinho reembolsado', 400);
    }
  }

  private async checkCupom(
    coupon_codes: string[],
    user_id: string,
    total_in_cart: number,
  ): Promise<Coupon[]> {
    let discount = 0;
    const coupons = Promise.all(
      coupon_codes.map(async coupon_code => {
        const coupon = await this.couponRepository.findBy({
          code: coupon_code,
        });
        if (!coupon) throw new AppError('Cupom não encontrado', 404);
        if (coupon.type == Coupon_type.exchange && user_id != coupon.user_id) {
          throw new AppError('Cupom não encontrado', 404);
        }
        if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
          throw new AppError('Cupom expirado', 400);
        if (coupon.quantity <= 0) throw new AppError('Cupom esgotado', 400);
        if (discount > total_in_cart)
          throw new AppError(
            'Cupom desnecessário, pois o valor do cupom já ultrapassou o valor do carrinho: ' +
              coupon.code +
              coupon.discount,
            400,
          );
        discount += coupon.discount;
        return coupon;
      }),
    );
    return coupons;
  }

  private async checkPaymentCardSplit(
    payment_cards: { card_id: string; percentage: number }[],
    total_in_cart: number,
  ): Promise<{ payment_card: PaymentCard; percentage: number }[]> {
    if (payment_cards.length == 0)
      throw new AppError('Nenhum cartão selecionado', 400);

    const validated_cards = await Promise.all(
      payment_cards.map(async card => {
        const payment_card = await this.paymentCardRepository.findBy({
          id: card.card_id,
        });
        if (!payment_card) throw new AppError('Cartão não encontrado', 404);
        return { payment_card, percentage: card.percentage };
      }),
    );

    const total_percentage = validated_cards.reduce(
      (total, card) => total + card.percentage,
      0,
    );
    if (total_percentage != 100)
      throw new AppError(
        'A soma das porcentagens do cartão deve ser 100%',
        400,
      );

    // min 10 reais
    const min_value = 10;
    const min_value_percentage = min_value / total_in_cart;
    validated_cards.forEach(card => {
      if (card.percentage < min_value_percentage)
        throw new AppError('Cada cartão deve pagar no minimo 10 reais', 400);
    });

    return validated_cards;
  }

  private async checkProducts(
    cart: Cart,
  ): Promise<{ product: Product; quantity: number }[]> {
    const products = await Promise.all(
      cart.cart_items.map(async item => {
        const product = await this.productRepository.findBy({
          id: item.product_id,
        });
        if (!product) throw new AppError('Produto não encontrado', 404);
        if (product.stock < item.quantity)
          throw new AppError('Quantidade de produto indisponível', 400);
        return { product, quantity: item.quantity };
      }),
    );

    return products;
  }

  private async confirmPayment({ ...datas }: ConfirmPayment): Promise<Cart> {
    datas.cart.status = Cart_status.APROVADA;
    datas.cart.paid_status = Paid_status.PAID;
    if (datas.coupon) {
      // datas.coupon.quantity -= 1;
      datas.coupon.map(coupon => {
        coupon.quantity -= 1;
      });
    }

    try {
      // TODO Payment Gateway Request
      // ...
    } catch (err) {
      datas.cart.status = Cart_status.REPROVADA;
      datas.cart.paid_status = Paid_status.NOT_PAID;
      throw new AppError('Pagamento não autorizado', 400);
    }

    if (datas.coupon && datas.coupon.length > 0) {
      Promise.all(
        datas.coupon.map(async coupon => {
          await this.couponRepository.update(coupon);
        }),
      );
    }
    datas.products.forEach(async product => {
      product.product.stock -= product.quantity;
      await this.productRepository.update({
        created_at: product.product.created_at,
        id: product.product.id,
        name: product.product.name,
        price: product.product.price,
        stock: product.product.stock,
        updated_at: product.product.updated_at,
        description: product.product.description,
        image: product.product.image,
      });
    });

    await this.cartRepository.update({
      created_at: datas.cart.created_at,
      id: datas.cart.id,
      user_id: datas.cart.user_id,
      address_id: datas.address.id,
      cupom_id: datas.coupon ? datas.coupon[0].id : null,
      coupon_ids: datas.coupon
        ? datas.coupon.map(coupon => {
            return coupon.id;
          })
        : [],
      expires_at: datas.cart.expires_at,
      paid_status: datas.cart.paid_status,
      status: datas.cart.status,
      updated_at: datas.cart.updated_at,
      cart_items: datas.cart.cart_items,
      cart_payment_cards: datas.cart.cart_payment_cards,
    });
    const updatedCart = await this.cartRepository.findBy({
      id: datas.cart.id,
    });
    if (!updatedCart) throw new AppError('Erro inexperado', 400);
    const discounts = datas.coupon?.map(coupon => coupon.discount);
    const total_discount = discounts
      ? discounts.reduce((total, discount) => total + discount, 0)
      : 0;
    const total_cart = sumTotalPrice(updatedCart, true);

    if (updatedCart.total_price < 0) {
      const coupon_difference = await this.couponRepository.create({
        code: 'DIF-' + Math.abs(updatedCart.total_price),
        discount: Math.abs(updatedCart.total_price),
        user_id: updatedCart.user_id,
        type: Coupon_type.exchange,
      });
    }
    console.log('differences');
    console.log(discounts, total_discount, total_cart);
    return updatedCart;
  }
}

export { PayCartService };
