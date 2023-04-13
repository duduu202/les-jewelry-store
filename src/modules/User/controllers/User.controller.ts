import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserService } from '../services/CreateUser.service';
import { DeleteUserService } from '../services/DeleteUser.service';
import { ShowUserService } from '../services/ShowUser.service';
import { UpdateUserService } from '../services/UpdateUser.service';
import { ListUserService } from '../services/ListUser.service';

class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password, CPF, phone } = req.body;
    // const avatar = req.file?.filename;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      name,
      email,
      password,
      CPF,
      phone,
    });

    return res.status(201).json(instanceToInstance(user));
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { user_id } = req.params;
    const { user: userRequest } = req;

    const showUserService = container.resolve(ShowUserService);

    const user = await showUserService.execute({
      user_id,
      isMaster: userRequest.isMaster,
      request_id: userRequest.id,
    });

    return res.json(user);
  }

  async index(req: Request, res: Response): Promise<Response> {
    const { page, limit, name } = req.query;

    const listUserService = container.resolve(ListUserService);

    const include = 'company';

    const users = await listUserService.execute({
      // filters: {
      //  company_client_id: req.user.company_id,
      // },
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
      include: include ? { [String(include)]: true } : undefined,
      search: name ? String(name) : undefined,
    });

    return res.json(instanceToInstance(users));
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { user_id } = req.params;
    const { ...data } = req.body;

    const updateUserService = container.resolve(UpdateUserService);

    const user = await updateUserService.execute({
      user_id,
      ...data,
    });

    return res.json(instanceToInstance(user));
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { user_id } = req.params;

    const deleteUserService = container.resolve(DeleteUserService);

    await deleteUserService.execute({
      user_id,
      request_id: '',
    });

    return res.status(204).send();
  }
}

export { UserController };
