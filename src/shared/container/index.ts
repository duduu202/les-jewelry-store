import { container } from 'tsyringe';

import './providers';

import { IUserRepository } from '@modules/User/repositories/UserRepository.interface';
import { UserRepository } from '@modules/User/repositories/UserRepository';
// import { IProjectTypeRepository } from '@modules/Project/repositories/repositories/ProjectTypeRepository.interface';
// import { IProjectSubTypeRepository } from '@modules/Project/repositories/repositories/ProjectSubTypeRepository.interface';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);

// container.registerSingleton<IProjectTypeRepository>(
//  'ProjectTypeRepository',
//  ProjectTypeRepository,
// );
