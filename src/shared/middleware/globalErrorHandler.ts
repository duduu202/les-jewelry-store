/* eslint-disable  @typescript-eslint/no-explicit-any */
import { CelebrateError } from 'celebrate';
import { Request, Response, NextFunction } from 'express';

import { logger } from '@config/winston';
import { AppError } from '../error/AppError';

export async function globalErrorHandler(
  err: Error,
  request: Request,
  response: Response,
  _: NextFunction,
): Promise<Response<any>> {
  const ip = request.headers['x-forwarded-for'] || request.ip;
  if (err instanceof AppError) {
    logger.error(
      `${err.statusCode} - ${err.message} - ${request.originalUrl} - ${
        request.method
      } - ${ip} - body: ${JSON.stringify(
        request.body,
      )} - params: ${JSON.stringify(request.params)} - query: ${JSON.stringify(
        request.query,
      )} - user: ${JSON.stringify(request.user)} - date: ${new Date()}`,
    );

    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err instanceof CelebrateError) {
    logger.error(
      `${400} - ${err.details.values().next().value.details[0].message} - ${
        request.originalUrl
      } - ${request.method} - ${ip} - body: ${JSON.stringify(
        request.body,
      )} - params: ${JSON.stringify(request.params)} - query: ${JSON.stringify(
        request.query,
      )} - user: ${JSON.stringify(request.user)} - date: ${new Date()}`,
    );

    let messageString;
    const { type, context } = err.details.values().next().value.details[0];
    const { valids } = context;

    switch (type) {
      case 'any.unknown':
        messageString = `O campo ${context.label} não é permitido.`;
        break;
      case 'object.unknown':
        messageString = `O campo ${context.label} não é permitido.`;
        break;
      case 'any.required':
        messageString = `O campo ${context.label} é obrigatório.`;
        break;
      case 'any.only':
        messageString = context.valids[0].path
          ? `O campo ${context.key} deve ter o mesmo valor do campo ${valids[0]}.`
          : `O campo ${context.key} pode ter o(s) valor(es): ${valids.join(
              ', ',
            )}`;

        break;
      case 'object.base':
        messageString = `O campo ${context.label} deve ser do tipo objeto.`;
        break;
      case 'string.base':
        messageString = `O campo ${context.label} deve ser do tipo texto.`;
        break;
      case 'string.guid':
        messageString = `O campo ${context.label} deve ser um id válido.`;
        break;
      case 'string.empty':
        messageString = `O campo ${context.label} não pode ser um texto vazio.`;
        break;
      case 'string.min':
        messageString = `O campo ${context.label} não pode ser menor que ${context.limit} caracteres.`;
        break;
      case 'string.max':
        messageString = `O campo ${context.label} não pode ser maior que ${context.limit} caracteres.`;
        break;
      case 'string.email':
        messageString = `O campo ${context.label} deve ser um email válido.`;
        break;
      case 'number.base':
        messageString = `O campo ${context.label} deve ser do tipo número.`;
        break;
      case 'number.min':
        messageString = `O campo ${context.label} não pode ser menor que ${context.limit}.`;
        break;
      case 'number.max':
        messageString = `O campo ${context.label} não pode ser maior que ${context.limit}.`;
        break;
      case 'array.sparse':
        messageString = `O campo ${context.label} não deve conter itens vazios.`;
        break;
      case 'array.base':
        messageString = `O campo ${context.label} deve ser do tipo array.`;
        break;
      case 'array.empty':
        messageString = `O campo ${context.label} não pode ser vazio.`;
        break;
      case 'array.min':
        messageString = `O campo ${context.label} não pode ter um quantidade menor que ${context.limit}.`;
        break;
      case 'array.max':
        messageString = `O campo ${context.label} não pode ter um quantidade maior que ${context.limit}.`;
        break;
      case 'array.length':
        messageString = `O campo ${context.label} deve ter ${context.limit} items.`;
        break;
      case 'string.length':
        messageString = `O campo ${context.label} deve ter ${context.limit} caracteres.`;
        break;
      case 'document.document':
        messageString = `O document é inválido.`;
        break;
      case 'date.base':
        messageString = `O campo ${context.label} não é uma data válida.`;
        break;
      case 'date.format':
        messageString = `A data ${context.label} não está no formato correto ${context.format}.`;
        break;
      case 'string.pattern.base':
        messageString = `O campo ${context.label} não está no formato correto ${
          context.regex || context.pattern
        }.`;
        break;
      default:
        console.log(type);
        messageString = 'Aconteceu um erro tente novamente mais tarde.';
        break;
    }

    return response.status(400).json({
      status: 'error',
      message: messageString,
    });
  }

  logger.error(
    `${500} - ${err.message} - ${request.originalUrl} - ${
      request.method
    } - ${ip} - body: ${JSON.stringify(
      request.body,
    )} - params: ${JSON.stringify(request.params)} - query: ${JSON.stringify(
      request.query,
    )} - user: ${JSON.stringify(request.user)} - date: ${new Date()}`,
  );

  return response.status(500).json({
    status: 'error',
    message: 'Server error',
  });
}
