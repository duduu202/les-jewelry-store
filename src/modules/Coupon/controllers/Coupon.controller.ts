import { UserRole } from '@prisma/client';
import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateCouponService } from '../services/CreateCoupon.service';
import { ListCouponService } from '../services/ListCoupon.service';
import { ShowCouponService } from '../services/ShowCoupon.service';
import { UpdateCouponService } from '../services/UpdateCoupon.service';

class CouponController {
  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { user } = req;

    const showCouponService = container.resolve(ShowCouponService);

    const coupon = await showCouponService.execute({
      id,
      request_id: user.role === UserRole.Master ? undefined : user.id,
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

  async create(req: Request, res: Response): Promise<Response> {
    const { code, discount, quantity } = req.body;

    const createCouponService = container.resolve(CreateCouponService);

    const coupon = await createCouponService.execute({
      code,
      discount: Number(discount),
      quantity: Number(quantity),
    });

    return res.status(201).json(instanceToInstance(coupon));
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { code, discount, quantity } = req.body;

    const updateCouponService = container.resolve(UpdateCouponService);

    const coupon = await updateCouponService.execute({
      id: req.params.id,
      code,
      discount: Number(discount),
      quantity: Number(quantity),
    });

    return res.status(201).json(instanceToInstance(coupon));
  }
}

export { CouponController };
