import { Router } from 'express';
import { verifyToken } from '@shared/middleware/verifyToken';
import { CouponController } from '../controllers/Coupon.controller';
import {
  createCouponMiddleware,
  listCouponMiddleware,
  showCouponMiddleware,
  updateCouponMiddleware,
} from './validators/coupon.validation';

const couponRouter = Router();

const couponController = new CouponController();
couponRouter.use(verifyToken);

couponRouter.get('/', listCouponMiddleware, couponController.index);

couponRouter.get('/:id', showCouponMiddleware, couponController.show);

couponRouter.put('/:id', updateCouponMiddleware, couponController.update);

couponRouter.post('/', createCouponMiddleware, couponController.create);

export { couponRouter };
