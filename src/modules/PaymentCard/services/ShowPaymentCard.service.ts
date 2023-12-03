import { AppError } from '@shared/error/AppError';
import { plainToInstance } from 'class-transformer';
import { inject, injectable } from 'tsyringe';
import { PaymentCard } from '../models/PaymentCard';
import { IPaymentCardRepository } from '../repositories/PaymentCardRepository.interface';
import { IShowPaymentCardDTO } from './dto/ShowPaymentCardDTO';

@injectable()
class ShowPaymentCardService {
  constructor(
    @inject('PaymentCardRepository')
    private paymentCardRepository: IPaymentCardRepository,
  ) {}

  public async execute({
    id,
    request_id,
  }: IShowPaymentCardDTO): Promise<PaymentCard> {
    const paymentCard = await this.paymentCardRepository.findBy({
      id,
      user_id: request_id,
    });

    if (!paymentCard) throw new AppError('Cartão não encontrado', 404);

    return plainToInstance(PaymentCard, paymentCard);
  }
}

export { ShowPaymentCardService };
