import { PaymentCard } from '@prisma/client';
import { prisma } from '@shared/database';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { IPaymentCardCreate } from './dto/PaymentCardRepositoryDTO';
import { IPaymentCardRepository } from './PaymentCardRepository.interface';
import { PaymentCard as EntityPaymentCard } from '../entities/PaymentCard';

class PaymentCardRepository implements IPaymentCardRepository {
  async findBy(
    filter: Partial<PaymentCard>,
    //include?: { [key: string]: boolean },
  ): Promise<EntityPaymentCard | null> {
    const paymentCard = await prisma.paymentCard.findFirst({
      where: { ...filter },
    });

    return paymentCard as EntityPaymentCard;
  }

  public async listBy({
    page = 1,
    limit = 10,
    filters,
    //search,
  }: IPaginatedRequest<PaymentCard>): Promise<IPaginatedResponse<EntityPaymentCard>> {
    const paymentCard = await prisma.paymentCard.findMany({
      where: filters && {
        ...filters,
        //name: {
        //  contains: search,
        //  mode: 'insensitive',
        //},
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const paymentCardTotal = await prisma.paymentCard.count({
      where: filters && {
        ...filters,
        //name: {
        //  contains: search,
        //  mode: 'insensitive',
        //},
      },
    });

    return {
      results: paymentCard as EntityPaymentCard[],
      total: paymentCardTotal,
      page,
      limit,
    };
  }

  async create({ ...datas }: IPaymentCardCreate): Promise<PaymentCard> {
    const paymentCard = await prisma.paymentCard.create({
      data: {
        ...datas
      },
    });
    return paymentCard;
  }

  async update({ id, ...datas }: PaymentCard): Promise<PaymentCard> {
    const updatedPaymentCard = await prisma.paymentCard.update({
      where: { id },
      data: {
        ...datas
      },
    });

    return updatedPaymentCard;
  }

  async remove(paymentCard: PaymentCard): Promise<void> {
    await prisma.paymentCard.delete({
      where: { id: paymentCard.id },
    });
  }
}

export { PaymentCardRepository };
