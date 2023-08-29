import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateAddressService } from '../services/CreateAddress.service';
import { DeleteAddressService } from '../services/DeleteAddress.service';
import { ListAddressService } from '../services/ListAddress.service';
import { ShowAddressService } from '../services/ShowAddress.service';
import { UpdateAddressService } from '../services/UpdateAddress.service';

class AddressController {
  async create(req: Request, res: Response): Promise<Response> {
    const { street, number, district, city, state, zip_code } = req.body;
    const createAddressService = container.resolve(CreateAddressService);

    const Address = await createAddressService.execute({
      city,
      district,
      number,
      state,
      street,
      zip_code,
      user_id: req.user.id,
    });

    return res.status(201).json(instanceToInstance(Address));
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { user } = req;

    const showAddressService = container.resolve(ShowAddressService);

    const Address = await showAddressService.execute({
      id,
      request_id: user.id,
    });

    return res.json(Address);
  }

  async index(req: Request, res: Response): Promise<Response> {
    const { page, limit, name } = req.query;

    const listAddressService = container.resolve(ListAddressService);

    const Addresss = await listAddressService.execute({
      filters: {
        user_id: req.user.id,
      },
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
      // include: include ? { [String(include)]: true } : undefined,
      search: name ? String(name) : undefined,
    });

    return res.json(instanceToInstance(Addresss));
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { ...data } = req.body;

    const updateAddressService = container.resolve(UpdateAddressService);

    const Address = await updateAddressService.execute({
      id,
      request_id: req.user.isMaster ? undefined : req.user.id,
      ...data,
    });

    return res.json(instanceToInstance(Address));
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleteAddressService = container.resolve(DeleteAddressService);

    await deleteAddressService.execute({
      id,
      request_id: req.user.id,
    });

    return res.status(204).send();
  }
}

export { AddressController };
