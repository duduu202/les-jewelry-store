import { Exclude } from 'class-transformer';
import { PaymentCard as IPaymentCard } from '@prisma/client';

class PaymentCard implements IPaymentCard {
  user_id: string;
  id: string;
  external_id: string;
  first_four_digits: string;
  last_four_digits: string;
  brand: string;
  holder_name: string;
  created_at: Date;
  updated_at: Date;
}

export { PaymentCard };
