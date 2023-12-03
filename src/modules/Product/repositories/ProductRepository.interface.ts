import { Product } from '@prisma/client';
import { IPaginatedRequest } from 'src/shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from 'src/shared/interfaces/IPaginatedResponse';
import { Product as EntityProduct } from '../models/Product';
import { IProductCreate, IProductUpdate } from './dto/ProductRepositoryDTO';

interface IProductRepository {
  findBy(
    filter: Partial<EntityProduct>,
    // include?: { [key: string]: boolean },
  ): Promise<EntityProduct | null>;
  listBy(
    filter: IPaginatedRequest<Product>,
  ): Promise<IPaginatedResponse<EntityProduct>>;
  create(product: IProductCreate): Promise<Product>;
  update(product: IProductUpdate): Promise<Product>;
  remove(product: Product): Promise<void>;
}

export { IProductRepository };
