import Joi, { ObjectSchema, StringSchema, NumberSchema } from "joi"

const roleSchema = {
  id: Joi.number().integer().positive()as NumberSchema,
  name: Joi.string().min(3).max(50).required() as StringSchema,
  description: Joi.string().max(200) as StringSchema
}

export const rolesSchema = {
  create: Joi.object({
    name: roleSchema.name.required(),
    description: roleSchema.description
  }) as ObjectSchema,
  update: Joi.object({
    id: roleSchema.id.required(),
    name: roleSchema.name,
    description: roleSchema.description
  }) as ObjectSchema,
  get: Joi.object({
    id: roleSchema.id.required()
  }) as ObjectSchema,
  delete: Joi.object({
    id: roleSchema.id.required()
  }) as ObjectSchema
}

export default rolesSchema
