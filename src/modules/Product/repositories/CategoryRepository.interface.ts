import { Category } from '@prisma/client';
import { IPaginatedRequest } from 'src/shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from 'src/shared/interfaces/IPaginatedResponse';

interface ICategoryRepository {
  findBy(
    filter: Partial<Category>,
    // include?: { [key: string]: boolean },
  ): Promise<Category | null>;
  listBy(
    filter: IPaginatedRequest<Category>,
  ): Promise<IPaginatedResponse<Category>>;
  create(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;
  remove(category: Category): Promise<void>;
}

export { ICategoryRepository };
