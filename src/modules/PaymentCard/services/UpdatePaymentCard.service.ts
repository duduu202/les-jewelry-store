import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { plainToInstance } from 'class-transformer';
import { IPaymentCardRepository } from '../repositories/PaymentCardRepository.interface';
import { IUpdatePaymentCardDTO } from './dto/UpdatePaymentCardDTO';
import { PaymentCard } from '../models/PaymentCard';

@injectable()
class UpdatePaymentCardService {
  constructor(
    @inject('PaymentCardRepository')
    private paymentCardRepository: IPaymentCardRepository,
  ) {}

  public async execute({
    id,
    request_id,
    ...paymentCardParams
  }: IUpdatePaymentCardDTO): Promise<PaymentCard> {
    const paymentCard = await this.paymentCardRepository.findBy({
      id,
      user_id: request_id,
    });

    if (!paymentCard) throw new AppError('Cartão não encontrado', 404);

    Object.assign(paymentCard, paymentCardParams);

    const newPaymentCard = await this.paymentCardRepository.update(paymentCard);

    return plainToInstance(PaymentCard, newPaymentCard);
  }
}

export { UpdatePaymentCardService };
