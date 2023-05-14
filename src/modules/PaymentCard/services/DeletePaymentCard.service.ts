import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { IPaymentCardRepository } from '../repositories/PaymentCardRepository.interface';
import { IDeletePaymentCardDTO } from './dto/DeletePaymentCardDTO';

@injectable()
class DeletePaymentCardService {
  constructor(
    @inject('PaymentCardRepository')
    private paymentCardRepository: IPaymentCardRepository,
  ) {}

  public async execute({ id, request_id }: IDeletePaymentCardDTO): Promise<void> {
    const paymentCard = await this.paymentCardRepository.findBy({ id, user_id: request_id });

    if (!paymentCard) throw new AppError('Enderço não encontrado', 404);

    await this.paymentCardRepository.remove(paymentCard);
  }
}

export { DeletePaymentCardService };
