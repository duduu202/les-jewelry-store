import { prisma_cache_time } from '@config/prismaCacheTime';
import { Category } from '@prisma/client';
import { prisma } from '@shared/database';
import { IPaginatedRequest } from '@shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from '@shared/interfaces/IPaginatedResponse';
import { ICategoryRepository } from './CategoryRepository.interface';

class CategoryRepository implements ICategoryRepository {
  async findBy(
    filter: Partial<Category>,
    // include?: { [key: string]: boolean },
  ): Promise<Category | null> {
    const category = (await prisma.category.findFirst({
      where: { ...filter },
    })) as Category;
    if (!category) return null;

    return category as Category;
  }

  public async listBy({
    page = 1,
    limit = 10,
    filters,
    search,
  }: IPaginatedRequest<Category>): Promise<IPaginatedResponse<Category>> {
    const categoryTotal = prisma.category.count({
      where: {
        ...filters,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      cacheStrategy: { ...prisma_cache_time },
    });

    const categories = prisma.category.findMany({
      where: {
        ...filters,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      cacheStrategy: { ...prisma_cache_time },
    });

    return {
      results: await categories,
      total: await categoryTotal,
      page,
      limit,
    };
  }

  async create({ ...datas }: Category): Promise<Category> {
    const category = await prisma.category.create({
      data: {
        ...datas,
      },
    });
    return category;
  }

  async update({ ...datas }: Category): Promise<Category> {
    const updatedCategory = await prisma.category.update({
      where: {
        name: datas.name,
      },
      data: {
        ...datas,
      },
    });

    return updatedCategory;
  }

  async remove(category: Category): Promise<void> {
    await prisma.category.delete({
      where: { name: category.name },
    });
  }
}

export { CategoryRepository };
