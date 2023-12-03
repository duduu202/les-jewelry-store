import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/error/AppError';
import { IHashProvider } from '@shared/container/providers/HashProvider/model/IHashProvider';
import { plainToInstance } from 'class-transformer';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { IUserRepository } from '../repositories/UserRepository.interface';
import { ICreateUserDTO } from './dto/CreateUserDTO';
import { User } from '../models/User';

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ ...userParams }: ICreateUserDTO): Promise<User> {
    const user_exists = await this.userRepository.findBy({
      email: userParams.email,
    });
    if (user_exists) throw new AppError('Email já cadastrado');

    const hashed_password = await this.hashProvider.generateHash(
      userParams.password,
    );

    const user = await this.userRepository.create({
      CPF: userParams.CPF,
      email: userParams.email,
      name: userParams.name,
      password: hashed_password,
      phone: userParams.phone,
    });

    return plainToInstance(User, user);
  }
}

export { CreateUserService };
