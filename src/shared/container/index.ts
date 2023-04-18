import { container } from 'tsyringe';

import './providers';

import { IUserRepository } from '@modules/User/repositories/UserRepository.interface';
import { UserRepository } from '@modules/User/repositories/UserRepository';
import { IAddressRepository } from '@modules/Address/repositories/AddressRepository.interface';
import { AddressRepository } from '@modules/Address/repositories/AddressRepository';
// import { IProjectTypeRepository } from '@modules/Project/repositories/repositories/ProjectTypeRepository.interface';
// import { IProjectSubTypeRepository } from '@modules/Project/repositories/repositories/ProjectSubTypeRepository.interface';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<IAddressRepository>('AddressRepository', AddressRepository);

// container.registerSingleton<IProjectTypeRepository>(
//  'ProjectTypeRepository',
//  ProjectTypeRepository,
// );
