import { celebrate, Joi, Segments } from 'celebrate';

export const showDashboardMiddleware = celebrate({
  [Segments.QUERY]: {
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().required(),
    groups: Joi.array()
      .items(
        Joi.object({
          categories: Joi.array().items(Joi.string().required()).required(),
        }).required(),
      )
      .default([]),
    division_split: Joi.number(),
    all_sales: Joi.boolean(),
  },
});
