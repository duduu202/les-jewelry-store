import { Router } from 'express';
import { verifyToken } from '@shared/middleware/verifyToken';
import { PaymentCardController } from '../controllers/PaymentCard.controller';
import { 
  createPaymentCardMiddleware,
  deletePaymentCardMiddleware,
  listPaymentCardMiddleware,
  showPaymentCardMiddleware,
  updatePaymentCardMiddleware
} from './validators/paymentCard.validation';

const paymentCardRouter = Router();

const paymentCardController = new PaymentCardController();
paymentCardRouter.use(verifyToken);

paymentCardRouter.post('/', createPaymentCardMiddleware, paymentCardController.create);
paymentCardRouter.get('/', listPaymentCardMiddleware, paymentCardController.index);
paymentCardRouter.get('/:id', showPaymentCardMiddleware, paymentCardController.show);
paymentCardRouter.delete('/:id', deletePaymentCardMiddleware, paymentCardController.delete);
paymentCardRouter.put('/:id', updatePaymentCardMiddleware, paymentCardController.update);


export { paymentCardRouter };
