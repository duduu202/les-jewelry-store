import { container } from 'tsyringe';

import './providers';

import { IUserRepository } from '@modules/User/repositories/UserRepository.interface';
import { UserRepository } from '@modules/User/repositories/UserRepository';
import { IAddressRepository } from '@modules/Address/repositories/AddressRepository.interface';
import { AddressRepository } from '@modules/Address/repositories/AddressRepository';
import { IProductRepository } from '@modules/Product/repositories/ProductRepository.interface';
import { ProductRepository } from '@modules/Product/repositories/ProductRepository';
import { ICartRepository } from '@modules/Cart/repositories/CartRepository.interface';
import { CartRepository } from '@modules/Cart/repositories/CartRepository';
import { PaymentCardRepository } from '@modules/PaymentCard/repositories/PaymentCardRepository';
import { IPaymentCardRepository } from '@modules/PaymentCard/repositories/PaymentCardRepository.interface';
import { CouponRepository } from '@modules/Coupon/repositories/CouponRepository';
import { ICouponRepository } from '@modules/Coupon/repositories/CouponRepository.interface';
import { ICategoryRepository } from '@modules/Product/repositories/CategoryRepository.interface';
import { CategoryRepository } from '@modules/Product/repositories/CategoryRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<IAddressRepository>(
  'AddressRepository',
  AddressRepository,
);
container.registerSingleton<IProductRepository>(
  'ProductRepository',
  ProductRepository,
);
container.registerSingleton<ICartRepository>('CartRepository', CartRepository);
container.registerSingleton<IPaymentCardRepository>(
  'PaymentCardRepository',
  PaymentCardRepository,
);
container.registerSingleton<ICouponRepository>(
  'CouponRepository',
  CouponRepository,
);
container.registerSingleton<ICategoryRepository>(
  'CategoryRepository',
  CategoryRepository,
);

// container.registerSingleton<IProjectTypeRepository>(
//  'ProjectTypeRepository',
//  ProjectTypeRepository,
// );
