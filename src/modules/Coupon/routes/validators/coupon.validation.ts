import { celebrate, Joi, Segments } from 'celebrate';

export const listCouponMiddleware = celebrate({
  [Segments.QUERY]: {
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(50),
    name: Joi.string(),
  },
});

export const showCouponMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().required(),
  },
});

export const createCouponMiddleware = celebrate({
  [Segments.BODY]: {
    code: Joi.string().required().min(3).label('código'),
    discount: Joi.number().required().min(0).label('desconto'),
    quantity: Joi.number().required().min(1).label('quantidade'),
  },
});

export const updateCouponMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().required(),
  },
  [Segments.BODY]: {
    code: Joi.string().required().min(3).label('código'),
    discount: Joi.number().required().min(0).label('desconto'),
    quantity: Joi.number().required().min(1).label('quantidade'),
  },
});
