import { celebrate, Joi, Segments } from 'celebrate';

export const createAddressMiddleware = celebrate({
  [Segments.BODY]: {
    street: Joi.string().required(),
    number: Joi.string().required(),
    district: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip_code: Joi.string().required(),
  },
});

export const listAddressMiddleware = celebrate({
  [Segments.QUERY]: {
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(50),
    name: Joi.string(),
  },
});

export const showAddressMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});

export const updateAddressMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
  [Segments.BODY]: {
    street: Joi.string(),
    number: Joi.string(),
    district: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    zip_code: Joi.string(),
  },
});

export const deleteAddressMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});
