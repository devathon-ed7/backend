import boom from "@hapi/boom";
import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

type Property = 'body' | 'query' | 'params';

export const validatorHandler = (schema: Schema, property: Property) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const data = request[property];
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      next(boom.badRequest(error.message, { details: error.details }));
    } else {
      next();
    }
  };
};
