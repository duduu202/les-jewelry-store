import { AppError } from '@shared/error/AppError';
import { inject, injectable } from 'tsyringe';

import { plainToInstance } from 'class-transformer';
import { IUserRepository } from '../repositories/UserRepository.interface';
import { IUpdateUserDTO } from './dto/UpdateUserDTO';
import { User } from '../entities/User';
import { IHashProvider } from '@shared/container/providers/HashProvider/model/IHashProvider';

@injectable()
class UpdateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    request_id,
    ...userParams
  }: IUpdateUserDTO): Promise<User> {
    const { password, ...rest } = userParams;
    if (request_id !== user_id && !userParams.isMaster)
     throw new AppError('Usuário não autorizado', 404);

    const user = await this.userRepository.findBy({
      id: user_id,
    });

    if (!user) throw new AppError('Usuário não encontrado', 404);

    const emailExists = await this.userRepository.findBy({
      email: userParams.email,
    });

    if (emailExists && emailExists.id !== user_id)
      throw new AppError('Email já cadastrado', 409);

    const CPFExists = await this.userRepository.findBy({
      CPF: userParams.CPF,
    });

    if (CPFExists && CPFExists.id !== user_id)
      throw new AppError('CPF já cadastrado', 409);

    if(userParams.CPF) user.CPF = userParams.CPF;
    if(userParams.email) user.email = userParams.email;
    if(userParams.name) user.name = userParams.name;
    if(userParams.phone) user.phone = userParams.phone;
    if(password){
      const hashed_password = await this.hashProvider.generateHash(
        password,
      );
      user.password = hashed_password;
    }

    const newUser = await this.userRepository.update(user);

    return plainToInstance(User, newUser);
  }
}

export { UpdateUserService };
