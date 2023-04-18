import { Exclude } from 'class-transformer';
import { Address as IAddress } from '@prisma/client';

class Address implements IAddress {
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
