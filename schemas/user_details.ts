import Joi, { ObjectSchema, StringSchema, NumberSchema } from 'joi';

const value = {
  id: Joi.number().integer().min(1) as NumberSchema,
  description: Joi.string().max(255).allow(null, '') as StringSchema,
  notes: Joi.string().max(255).allow(null, '') as StringSchema,
  user_account_id: Joi.number().integer().min(1) as NumberSchema,
  role_id: Joi.number().integer().min(1) as NumberSchema,
};


export const userDetailsSchema = {
  get: Joi.object({ id: value.id.required() }),
  update: Joi.object({
    description: value.description,
    notes: value.notes,
    user_account_id: value.user_account_id,
    role_id: value.role_id,
  }) as ObjectSchema,
};