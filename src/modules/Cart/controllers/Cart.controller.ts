import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateCartService } from '../services/CreateCart.service';
import { DeleteCartService } from '../services/DeleteCart.service';
import { ListCartService } from '../services/ListCart.service';
import { PayCartService } from '../services/PayCart.service';
import { ShowCartService } from '../services/ShowCart.service';
import { UpdateCartService } from '../services/UpdateCart.service';



class CartController {
  async create(req: Request, res: Response): Promise<Response> {
    const { items, cupom_code } = req.body;
    const createCartService = container.resolve(CreateCartService);

    const Cart = await createCartService.execute({
      request_id: req.user.id,
      cart_items: items,
      cupom_code,
    });

    return res.status(201).json(instanceToInstance(Cart));
  }

  async pay(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { user } = req;
    const { payment_cards, coupon_code, address_id } = req.body;

    const payCartService = container.resolve(PayCartService);

    const Cart = await payCartService.execute({
      cart_id: id,
      payment_cards,
      request_id: user.id,
      coupon_code,
      address_id
    });

    return res.json(Cart);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { user } = req;

    const showCartService = container.resolve(ShowCartService);

    const Cart = await showCartService.execute({
      id,
      request_id: user.id,
    });

    return res.json(Cart);
  }

  async index(req: Request, res: Response): Promise<Response> {
    const { page, limit, name } = req.query;

    const listCartService = container.resolve(ListCartService);

    const Carts = await listCartService.execute({
      filters: {
        user_id: req.user.id,
      },
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
      // include: include ? { [String(include)]: true } : undefined,
      search: name ? String(name) : undefined,
    });

    return res.json(instanceToInstance(Carts));
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { items } = req.body;

    const updateCartService = container.resolve(UpdateCartService);

    const Cart = await updateCartService.execute({
      id,
      request_id: req.user.id,
      cart_items: items,
    });

    return res.json(instanceToInstance(Cart));
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleteCartService = container.resolve(DeleteCartService);

    await deleteCartService.execute({
      id,
      request_id: req.user.id,
    });

    return res.status(204).send();
  }
}

export { CartController };