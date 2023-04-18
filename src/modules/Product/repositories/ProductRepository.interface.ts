import { Product } from '@prisma/client';
import { IPaginatedRequest } from 'src/shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from 'src/shared/interfaces/IPaginatedResponse';
import { Product as EntityProduct } from '../entities/Product';
import { IProductCreate } from './dto/ProductRepositoryDTO';

interface IProductRepository {
  findBy(
    filter: Partial<Product>,
    //include?: { [key: string]: boolean },
  ): Promise<EntityProduct | null>;
  listBy(
    filter: IPaginatedRequest<Product>,
  ): Promise<IPaginatedResponse<EntityProduct>>;
  create(product: IProductCreate): Promise<Product>;
  update(product: Product): Promise<Product>;
  remove(product: Product): Promise<void>;
}

export { IProductRepository };
