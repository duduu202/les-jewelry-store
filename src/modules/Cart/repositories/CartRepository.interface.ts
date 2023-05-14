import { Cart } from '@prisma/client';
import { IPaginatedRequest } from 'src/shared/interfaces/IPaginatedRequest';
import { IPaginatedResponse } from 'src/shared/interfaces/IPaginatedResponse';
import { Cart as EntityCart } from '../entities/Cart';
import { ICartCreate } from './dto/CartRepositoryDTO';

interface ICartRepository {
  findBy(
    filter: Partial<Cart>,
    //include?: { [key: string]: boolean },
  ): Promise<EntityCart | null>;
  listBy(
    filter: IPaginatedRequest<Cart>,
  ): Promise<IPaginatedResponse<EntityCart>>;
  create(cart: ICartCreate): Promise<Cart>;
  update(cart: EntityCart): Promise<Cart>;
  remove(cart: Cart): Promise<void>;
}

export { ICartRepository };
