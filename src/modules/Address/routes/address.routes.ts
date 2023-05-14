import { Router } from 'express';
import { verifyToken } from '@shared/middleware/verifyToken';
import { AddressController } from '../controllers/Address.controller';
import { 
  createAddressMiddleware,
  deleteAddressMiddleware,
  listAddressMiddleware,
  showAddressMiddleware,
  updateAddressMiddleware
} from './validators/address.validation';

const addressRouter = Router();

const addressController = new AddressController();
addressRouter.use(verifyToken);

addressRouter.post('/', createAddressMiddleware, addressController.create);
addressRouter.get('/', listAddressMiddleware, addressController.index);
addressRouter.get('/:id', showAddressMiddleware, addressController.show);
addressRouter.delete('/:id', deleteAddressMiddleware, addressController.delete);
addressRouter.put('/:id', updateAddressMiddleware, addressController.update);


export { addressRouter };
