import { IPaginatedRequest } from './IPaginatedRequest';
import { IPaginatedResponse } from './IPaginatedResponse';

interface IRepository<T, ICreate, IUpdate> {
  findBy(filter: Partial<T>): Promise<T | null>;
  listBy(filter: IPaginatedRequest<T>): Promise<IPaginatedResponse<T>>;
  create(user: Partial<T>): Promise<T>;
  update(user: ICreate): Promise<T>;
  remove(user: IUpdate): Promise<void>;
}

export { IRepository };
