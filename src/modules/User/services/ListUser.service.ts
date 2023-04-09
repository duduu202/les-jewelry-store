import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { plainToInstance } from 'class-transformer';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IUserRepository } from '../repositories/UserRepository.interface';
import { User } from '../entities/User';

@injectable()
class ListUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({
    filters,
    limit,
    page,
    include,
    search,
  }: IPaginatedRequest<User>): Promise<User> {
    const user = await this.userRepository.listBy({
      filters,
      limit,
      page,
      include,
      search,
    });

    if (!user) throw new AppError('Usuário não encontrado', 404);

    return plainToInstance(User, user);
  }
}

export { ListUserService };
