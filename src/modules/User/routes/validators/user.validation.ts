import { celebrate, Joi, Segments } from 'celebrate';

export const createUserMiddleware = celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    CPF: Joi.string().min(11).max(11),
    email: Joi.string().email().required(),
    password: Joi.string().min(8),
  },
});

export const listUserMiddleware = celebrate({
  [Segments.QUERY]: {
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(50),
    name: Joi.string(),
  },
});

export const showUserMiddleware = celebrate({
  [Segments.PARAMS]: {
    user_id: Joi.string().uuid().required(),
  },
});

export const updateUserMiddleware = celebrate({
  [Segments.PARAMS]: {
    user_id: Joi.string().uuid().required(),
  },
  [Segments.BODY]: {
    name: Joi.string(),
    CPF: Joi.string().min(11).max(11),
    email: Joi.string().email(),
    password: Joi.string().min(8),
  },
});

export const deleteUserMiddleware = celebrate({
  [Segments.PARAMS]: {
    user_id: Joi.string().uuid().required(),
  },
});
