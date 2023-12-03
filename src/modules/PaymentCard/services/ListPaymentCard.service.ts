import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { plainToInstance } from 'class-transformer';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaymentCardRepository } from '../repositories/PaymentCardRepository.interface';
import { PaymentCard } from '../models/PaymentCard';

@injectable()
class ListPaymentCardService {
  constructor(
    @inject('PaymentCardRepository')
    private paymentCardRepository: IPaymentCardRepository,
  ) {}

  public async execute({
    filters,
    limit,
    page,
    include,
    search,
  }: IPaginatedRequest<PaymentCard>): Promise<PaymentCard> {
    const paymentCard = await this.paymentCardRepository.listBy({
      filters,
      limit,
      page,
      include,
      search,
    });

    if (!paymentCard) throw new AppError('Cartão não encontrado', 404);

    return plainToInstance(PaymentCard, paymentCard);
  }
}

export { ListPaymentCardService };
