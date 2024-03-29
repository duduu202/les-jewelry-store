import { Router } from 'express';
import { verifyToken } from '@shared/middleware/verifyToken';
import { CartController } from '../controllers/Cart.controller';
import {
  patchCartMiddleware,
  createCartMiddleware,
  deleteCartMiddleware,
  listCartMiddleware,
  payCartMiddleware,
  showCartMiddleware,
  updateCartMiddleware,
  refundCartMiddleware,
} from './validators/cart.validation';

const cartRouter = Router();

const cartController = new CartController();
cartRouter.use(verifyToken);

cartRouter.post('/', createCartMiddleware, cartController.create);
cartRouter.post('/pay/:id', payCartMiddleware, cartController.pay);
cartRouter.post('/refund/:id', refundCartMiddleware, cartController.refund);
cartRouter.get('/', listCartMiddleware, cartController.index);
cartRouter.get('/current_cart', cartController.current_cart);
cartRouter.get('/:id', showCartMiddleware, cartController.show);
cartRouter.delete('/:id', deleteCartMiddleware, cartController.delete);
cartRouter.put('/:id', updateCartMiddleware, cartController.update);
cartRouter.patch('/:id', patchCartMiddleware, cartController.patch);

export { cartRouter };
