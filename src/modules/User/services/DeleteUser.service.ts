import { UserRole } from '@prisma/client';
import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { IUserRepository } from '../repositories/UserRepository.interface';
import { IDeleteUserDTO } from './dto/DeleteUserDTO';

@injectable()
class DeleteUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ user_id }: IDeleteUserDTO): Promise<void> {
    // const requestUser = await this.userRepository.findBy({ id: request_id });
    const user = await this.userRepository.findBy({ id: user_id });

    if (!user) throw new AppError('Usuário não encontrado', 404);

    // if (!requestUser) throw new AppError('Usuário não autorizado', 404);
    //
    // if (requestUser.role !== UserRole.Master || requestUser.id !== user_id) {
    //  throw new AppError('Usuário não autorizado', 403);
    // }

    await this.userRepository.remove(user);
  }
}

export { DeleteUserService };
