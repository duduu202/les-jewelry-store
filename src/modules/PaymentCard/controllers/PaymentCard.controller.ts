import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreatePaymentCardService } from '../services/CreatePaymentCard.service';
import { DeletePaymentCardService } from '../services/DeletePaymentCard.service';
import { ListPaymentCardService } from '../services/ListPaymentCard.service';
import { ShowPaymentCardService } from '../services/ShowPaymentCard.service';
import { UpdatePaymentCardService } from '../services/UpdatePaymentCard.service';



class PaymentCardController {
  async create(req: Request, res: Response): Promise<Response> {
    const { external_id, first_four_digits, last_four_digits, brand, holder_name } = req.body;
    
    const createPaymentCardService = container.resolve(CreatePaymentCardService);

    const PaymentCard = await createPaymentCardService.execute({
      external_id,
      first_four_digits,
      last_four_digits,
      brand,
      holder_name,
      request_id: req.user.id,
    });

    return res.status(201).json(instanceToInstance(PaymentCard));
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { user } = req;

    const showPaymentCardService = container.resolve(ShowPaymentCardService);

    const PaymentCard = await showPaymentCardService.execute({
      id,
      request_id: user.id,
    });

    return res.json(PaymentCard);
  }

  async index(req: Request, res: Response): Promise<Response> {
    const { page, limit, name } = req.query;

    const listPaymentCardService = container.resolve(ListPaymentCardService);

    const PaymentCards = await listPaymentCardService.execute({
      filters: {
        user_id: req.user.id,
      },
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
      // include: include ? { [String(include)]: true } : undefined,
      search: name ? String(name) : undefined,
    });

    return res.json(instanceToInstance(PaymentCards));
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { ...data } = req.body;

    const updatePaymentCardService = container.resolve(UpdatePaymentCardService);

    const PaymentCard = await updatePaymentCardService.execute({
      id,
      request_id: req.user.id,
      ...data,
    });

    return res.json(instanceToInstance(PaymentCard));
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deletePaymentCardService = container.resolve(DeletePaymentCardService);

    await deletePaymentCardService.execute({
      id,
      request_id: req.user.id,
    });

    return res.status(204).send();
  }
}

export { PaymentCardController };
