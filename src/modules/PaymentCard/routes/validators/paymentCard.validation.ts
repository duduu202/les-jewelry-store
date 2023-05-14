import { celebrate, Joi, Segments } from 'celebrate';

export const createPaymentCardMiddleware = celebrate({
  [Segments.BODY]: {
    external_id: Joi.string().required(),
    first_four_digits: Joi.string().required().min(4).max(4),
    last_four_digits: Joi.string().required().min(4).max(4),
    brand: Joi.string().required(),
    holder_name: Joi.string().required(),
  },
});

export const listPaymentCardMiddleware = celebrate({
  [Segments.QUERY]: {
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(50),
    name: Joi.string(),
  },
});

export const showPaymentCardMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});

export const updatePaymentCardMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
  [Segments.BODY]: {
    external_id: Joi.string(),
    first_four_digits: Joi.string(),
    last_four_digits: Joi.string(),
    brand: Joi.string(),
    holder_name: Joi.string(),
  },
});

export const deletePaymentCardMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});
