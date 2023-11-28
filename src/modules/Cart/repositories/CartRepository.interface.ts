import { Cart } from '@prisma/client';
import { IPaginatedRequest } from 'src/shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from 'src/shared/interfaces/IPaginatedResponse';
import { Cart as EntityCart } from '../entities/Cart';
import { ICartCreate, ICartUpdate } from './dto/CartRepositoryDTO';

interface ICustomFilters {
  start_date?: Date;
  end_date?: Date;
  categories?: string[];
}
interface ICartRepository {
  findBy(
    filter: Partial<EntityCart>,
    // include?: { [key: string]: boolean },
  ): Promise<EntityCart | null>;
  listBy(
    filter: IPaginatedRequest<Cart, ICustomFilters>,
  ): Promise<IPaginatedResponse<EntityCart>>;
  create(cart: ICartCreate): Promise<Cart>;
  update(cart: ICartUpdate): Promise<EntityCart>;
  updateStatus(cart: ICartUpdate): Promise<EntityCart>;
  remove(cart: Cart): Promise<void>;
}

export { ICartRepository };
