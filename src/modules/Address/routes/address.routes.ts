import { Router } from 'express';
import { verifyToken } from '@shared/middleware/verifyToken';
import { AddressController } from '../controllers/Addres.controller';
import { 
  createAddressMiddleware,
  deleteAddressMiddleware,
  listAddressMiddleware,
  updateAddressMiddleware
} from './validators/address.validation';

const addressRouter = Router();

const addressController = new AddressController();
addressRouter.use(verifyToken);

addressRouter.post('/', createAddressMiddleware, addressController.create);
addressRouter.get('/', listAddressMiddleware, addressController.index);
addressRouter.delete('/:id', deleteAddressMiddleware, addressController.delete);
addressRouter.put('/:id', updateAddressMiddleware, addressController.update);


export { addressRouter };
