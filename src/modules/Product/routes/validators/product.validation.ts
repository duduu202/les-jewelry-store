import { celebrate, Joi, Segments } from 'celebrate';

export const createProductMiddleware = celebrate({
  [Segments.BODY]: {
    price: Joi.number().required(),
    stock: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string(),
    image: Joi.any(),
  },
});

export const listProductMiddleware = celebrate({
  [Segments.QUERY]: {
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(50),
    name: Joi.string(),
  },
});

export const showProductMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});

export const updateProductMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
  [Segments.BODY]: {
    price: Joi.number(),
    stock: Joi.number(),
    name: Joi.string(),
    description: Joi.string(),
    image: Joi.any(),
  },
});

export const deleteProductMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});

export const refundProductMiddleware = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});
