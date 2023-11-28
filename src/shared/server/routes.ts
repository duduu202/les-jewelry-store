import { Router, Request, Response, NextFunction } from 'express';

import { userRouter } from '@modules/User/routes/user.routes';
import { addressRouter } from '@modules/Address/routes/address.routes';
import { productRouter } from '@modules/Product/routes/product.routes';
import { cartRouter } from '@modules/Cart/routes/cart.routes';
import { paymentCardRouter } from '@modules/PaymentCard/routes/paymentCard.routes';
import { couponRouter } from '@modules/Coupon/routes/coupon.routes';
import { dashboardRouter } from '@modules/Dashboard/routes/dashboard.routes';

const router = Router();

router.use('/user', userRouter);
router.use('/address', addressRouter);
router.use('/product', productRouter);
router.use('/cart', cartRouter);
router.use('/payment_card', paymentCardRouter);
router.use('/coupon', couponRouter);
router.use('/dashboard', dashboardRouter);

router.get('/', (request: Request, response: Response) =>
  response.send('jewelry store - 0.0.1'),
);

router.use((request: Request, response: Response, next: NextFunction) => {
  if (!request.route)
    return response.status(404).send(`${request.url} não encontrado`);
  return next();
});

export { router };
