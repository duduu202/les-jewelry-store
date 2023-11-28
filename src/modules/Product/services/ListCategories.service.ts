import { inject, injectable } from 'tsyringe';
import { Category } from '@prisma/client';
import { IPaginatedResponse } from 'src/shared/interfaces/IPaginatedResponse';
import { ICategoryRepository } from '../repositories/CategoryRepository.interface';

@injectable()
class ListCategoryService {
  constructor(
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository,
  ) {}

  public async execute(): Promise<IPaginatedResponse<Category>> {
    const category = await this.categoryRepository.listBy({});

    return category;
  }
}

export { ListCategoryService };
