import { PaymentCard } from '@prisma/client';
import { IPaginatedRequest } from 'src/shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from 'src/shared/interfaces/IPaginatedResponse';
import { PaymentCard as EntityPaymentCard } from '../entities/PaymentCard';
import { IPaymentCardCreate } from './dto/PaymentCardRepositoryDTO';

interface IPaymentCardRepository {
  findBy(
    filter: Partial<PaymentCard>,
    //include?: { [key: string]: boolean },
  ): Promise<EntityPaymentCard | null>;
  listBy(
    filter: IPaginatedRequest<PaymentCard>,
  ): Promise<IPaginatedResponse<EntityPaymentCard>>;
  create(paymentCard: IPaymentCardCreate): Promise<PaymentCard>;
  update(paymentCard: PaymentCard): Promise<PaymentCard>;
  remove(paymentCard: PaymentCard): Promise<void>;
}

export { IPaymentCardRepository };
