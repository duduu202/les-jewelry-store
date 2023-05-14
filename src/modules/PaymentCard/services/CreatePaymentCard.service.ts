import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/error/AppError';
import { IHashProvider } from '@shared/container/providers/HashProvider/model/IHashProvider';
import { plainToInstance } from 'class-transformer';
import { IPaymentCardRepository } from '../repositories/PaymentCardRepository.interface';
import { ICreatePaymentCardDTO } from './dto/CreatePaymentCardDTO';
import { PaymentCard } from '../entities/PaymentCard';

@injectable()
class CreatePaymentCardService {
  constructor(
    @inject('PaymentCardRepository')
    private paymentCardRepository: IPaymentCardRepository,
    
  ) {}

  public async execute({ ...paymentCardParams }: ICreatePaymentCardDTO): Promise<PaymentCard> {
    const { request_id, ...restParams} = paymentCardParams;
    
    const paymentCard = await this.paymentCardRepository.create({
      user_id: paymentCardParams.request_id,
      ...restParams,
    });

    return plainToInstance(PaymentCard, paymentCard);
  }
}

export { CreatePaymentCardService };
