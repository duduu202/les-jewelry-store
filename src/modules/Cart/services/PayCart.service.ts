import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/error/AppError';
import { IHashProvider } from '@shared/container/providers/HashProvider/model/IHashProvider';
import { plainToInstance } from 'class-transformer';
import { IProductRepository } from '@modules/Product/repositories/ProductRepository.interface';
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
import { v4 } from 'uuid';
import { IPayCartDTO } from './dto/PayCartDTO copy';
import { Cart } from '../entities/Cart';
import { ICartRepository } from '../repositories/CartRepository.interface';

interface IConfirmPayment {
  cart: Cart;
  validated_cards: { payment_card: PaymentCard; percentage: number }[];
  products: { product: Product; quantity: number }[];
  total_value: number;
  cupom_id?: string;
  discount: number;
  coupons?: Coupon[];
  address: Address;
}
@injectable()
class PayCartService {
  freight_value_percentage =
    (Number(process.env.FREIGHT_VALUE_PERCENTAGE) || 0) / 100;
  // 0.1;

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
    // this.time_available_in_minutes = time_available_in_minutes;
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
    let discount = 0;
    let coupons: Coupon[] = [];
    const total_value = products.reduce((total, product) => {
      return total + product.product.price * product.quantity;
    }, 0);

    if (coupon_codes && coupon_codes.length > 0) {
      // coupon = await this.checkCupom(coupon_code, request_id);
      // discount += coupon.discount;

      coupons = await Promise.all(
        coupon_codes.map(async code => {
          return this.checkCupom(code, request_id);
        }),
      );

      coupons.forEach(coup => {
        discount += coup.discount;
      });
    }

    console.log('payment_cards');
    console.log(payment_cards);
    const validated_cards = await this.checkPaymentCardSplit(
      payment_cards,
      total_value,
    );

    this.checkUnnecessaryCupons({
      cart,
      validated_cards,
      products,
      total_value,
      discount,
      coupons,
      address,
    });

    const updated_cart = await this.confirmPayment({
      cart,
      validated_cards,
      products,
      total_value,
      discount,
      coupons,
      address,
    });

    return plainToInstance(Cart, updated_cart);
  }

  private checkUnnecessaryCupons(datas: IConfirmPayment): void {
    let total_discount = 0;
    const total =
      datas.total_value + datas.total_value * this.freight_value_percentage;
    let beyond = false;

    datas.coupons?.forEach(coup => {
      total_discount += coup.discount;
      if (total_discount > total) {
        if (beyond) {
          throw new AppError(
            'Cupons desnecessários, retire um ou mais cupons',
            400,
          );
        }
        beyond = true;
      }
    });
  }

  private async checkCart(cart: Cart): Promise<void> {
    if (cart.expires_at && new Date(cart.expires_at) < new Date()) {
      cart.status = Cart_status.REPROVADA;
      cart.paid_status = Paid_status.EXPIRED;
      await this.cartRepository.remove(cart);
      throw new AppError('Carrinho expirado', 400);
    }
    if (cart.paid_status == Paid_status.PAID) {
      if (cart.is_current) {
        cart.is_current = false;
        await this.cartRepository.update(cart);
      }
      throw new AppError('Carrinho já pago', 400);
    }
    if (cart.paid_status == Paid_status.REFUNDED) {
      throw new AppError('Carrinho reembolsado', 400);
    }
  }

  private async checkCupom(
    coupon_code: string,
    user_id: string,
  ): Promise<Coupon> {
    const coupon = await this.couponRepository.findBy({
      id: coupon_code,
    });
    if (!coupon) throw new AppError('Cupom não encontrado', 404);
    if (coupon.type == Coupon_type.exchange && user_id != coupon.user_id) {
      throw new AppError('Cupom não encontrado', 404);
    }
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
      throw new AppError('Cupom expirado', 400);
    if (coupon.quantity <= 0) throw new AppError('Cupom esgotado', 400);
    return coupon;
  }

  private async checkPaymentCardSplit(
    payment_cards: { card_id: string; percentage: number }[],
    cart_value: number,
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

    validated_cards.forEach(card => {
      const toPay = (cart_value * card.percentage) / 100;

      // if (card.percentage < min_value_percentage)
      if (toPay < min_value)
        throw new AppError(
          `Cada cartão deve pagar no minimo 10 reais - $${toPay.toFixed(2)}`,
          400,
        );
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

  private async confirmPayment({ ...datas }: IConfirmPayment): Promise<Cart> {
    datas.cart.status = Cart_status.APROVADA;
    datas.cart.paid_status = Paid_status.PAID;
    if (datas.coupons && datas.coupons.length > 0) {
      // datas.coupon.quantity -= 1;

      datas.coupons.forEach(coup => {
        coup.quantity -= 1;
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

    if (datas.coupons && datas.coupons.length > 0) {
      // await this.couponRepository.update(datas.coupon);
      await Promise.all(
        datas.coupons.map(async coup => {
          await this.couponRepository.update(coup);
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

    const cart = await this.cartRepository.update({
      created_at: datas.cart.created_at,
      id: datas.cart.id,
      user_id: datas.cart.user_id,
      address_id: datas.address.id,
      cart_coupons:
        datas.coupons?.map(coup => {
          return {
            id: v4(),
            coupon_id: coup.id,
            created_at: new Date(),
            updated_at: new Date(),
          };
        }) || [],
      expires_at: datas.cart.expires_at,
      paid_status: datas.cart.paid_status,
      status: datas.cart.status,
      updated_at: datas.cart.updated_at,
      cart_items: datas.cart.cart_items,
      cart_payment_cards: datas.cart.cart_payment_cards,
      is_current: false,
    });

    await this.generateCouponWhenNegative(datas);

    return cart;
  }

  private async generateCouponWhenNegative(
    datas: IConfirmPayment,
  ): Promise<Coupon | undefined> {
    datas.total_value += datas.total_value * this.freight_value_percentage;
    datas.total_value -= datas.discount;
    if (datas.total_value < 0) {
      const discount = datas.total_value * -1;
      const coupon = await this.couponRepository.create({
        code: `DESCONTO-${discount.toFixed(2)}`,
        discount,
        type: Coupon_type.discount,
        user_id: datas.cart.user_id,
      });

      return coupon;
    }

    return undefined;
  }
}

export { PayCartService };
