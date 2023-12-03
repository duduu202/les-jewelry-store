import { Prisma } from '@prisma/client';
import { User } from '@modules/User/models/User';

type IAddress = Prisma.AddressGetPayload<{
  include: { user: true };
}>;
class Address implements IAddress {
  name: string;

  user: User;

  id: string;

  user_id: string;

  street: string;

  number: string;

  district: string;

  city: string;

  state: string;

  zip_code: string;

  created_at: Date;

  updated_at: Date;
}

export { Address };
