import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListCouponService } from '../services/ListCoupon.service';
import { ShowCouponService } from '../services/ShowCoupon.service';

class CouponController {
  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { user } = req;

    const showCouponService = container.resolve(ShowCouponService);

    const coupon = await showCouponService.execute({
      id,
      request_id: user.id,
    });

    return res.json(coupon);
  }

  async index(req: Request, res: Response): Promise<Response> {
    const { page, limit, name } = req.query;

    const listCouponService = container.resolve(ListCouponService);

    const coupons = await listCouponService.execute({
      filters: {
        user_id: req.user.id,
      },
      limit: limit ? Number(limit) : undefined,
      page: page ? Number(page) : undefined,
      // include: include ? { [String(include)]: true } : undefined,
      search: name ? String(name) : undefined,
    });

    return res.json(instanceToInstance(coupons));
  }
}

export { CouponController };
