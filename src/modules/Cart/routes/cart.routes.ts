import { Router } from 'express';
import { verifyToken } from '@shared/middleware/verifyToken';
import { CartController } from '../controllers/Cart.controller';
import { 
  createCartMiddleware,
  deleteCartMiddleware,
  listCartMiddleware,
  payCartMiddleware,
  updateCartMiddleware
} from './validators/cart.validation';

const cartRouter = Router();

const cartController = new CartController();
cartRouter.use(verifyToken);

cartRouter.post('/', createCartMiddleware, cartController.create);
cartRouter.post('/pay/:id', payCartMiddleware, cartController.pay);
cartRouter.get('/', listCartMiddleware, cartController.index);
cartRouter.delete('/:id', deleteCartMiddleware, cartController.delete);
cartRouter.put('/:id', updateCartMiddleware, cartController.update);


export { cartRouter };
