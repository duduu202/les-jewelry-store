import { celebrate, Joi, Segments } from 'celebrate';

export const createCartMiddleware = celebrate({
  [Segments.BODY]: {
    items: Joi.array().items(
      Joi.object({
        product_id: Joi.string().uuid().required(),
        quantity: Joi.number().min(1).required(),
      }),
    ).min(1).required(),
    cupom_code: Joi.string(),
  },
});

export const payCartMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
  [Segments.BODY]: {
    payment_cards: Joi.array().items(
      Joi.object({
        payment_card_id: Joi.string().uuid().required(),
        percentage: Joi.number().min(1).max(100).required(),
      }),
    ).min(1).required(),
    coupon_code: Joi.string(),
    address_id: Joi.string().uuid().required(),
  },
});

export const listCartMiddleware = celebrate({
  [Segments.QUERY]: {
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(50),
    name: Joi.string(),
  },
});

export const showCartMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});

export const updateCartMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
  [Segments.BODY]: {
    items: Joi.array().items(
      Joi.object({
        product_id: Joi.string().uuid().required(),
        quantity: Joi.number().min(1).required(),
      }),
    ).min(1).required(),
    cupom_code: Joi.string(),
  },
});

export const deleteCartMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});
