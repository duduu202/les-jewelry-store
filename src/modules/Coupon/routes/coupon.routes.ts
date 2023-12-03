import { Router } from 'express';
import { verifyToken } from '@shared/middleware/verifyToken';
import { CouponController } from '../controllers/Coupon.controller';
import {
  listCouponMiddleware,
  showCouponMiddleware,
} from './validators/coupon.validation';

const couponRouter = Router();

const couponController = new CouponController();
couponRouter.use(verifyToken);

couponRouter.get('/', listCouponMiddleware, couponController.index);

couponRouter.get('/:id', showCouponMiddleware, couponController.show);

couponRouter.put('/:id', couponController.update);

couponRouter.post('/', couponController.create);

export { couponRouter };
