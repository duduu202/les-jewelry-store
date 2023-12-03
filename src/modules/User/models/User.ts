import { Exclude } from 'class-transformer';
import { Prisma, UserRole } from '@prisma/client';
import { Address } from '@modules/Address/models/Address';
import { Cart } from '@modules/Cart/models/Cart';

type IUser = Prisma.UserGetPayload<{
  include: {
    address: true;
    charge_address: true;
    delivery_address: true;
    current_cart: true;
  };
}>;

class User implements IUser {
  charge_address: Address | null;

  delivery_address: Address | null;

  current_cart: Cart | null;

  address: Address[];

  charge_address_id: string | null;

  delivery_address_id: string | null;

  current_cart_id: string | null;

  phone: string;

  id: string;

  name: string;

  CPF: string | null;

  email: string;

  @Exclude()
  password: string;

  role: UserRole;

  created_at: Date;

  updated_at: Date;
}

export { User };
