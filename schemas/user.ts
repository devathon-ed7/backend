import Joi from "joi"

//user schema
const userIdSchema = Joi.number().integer().positive()
const userUsernameSchema = Joi.string().min(3).max(30)
const userPasswordSchema = Joi.string().min(6).max(50)

//user create schema
const userSchema = Joi.object({
  id: userIdSchema,
  username: userUsernameSchema,
  password: userPasswordSchema
})

//operation schema

const createUserSchema = userSchema.keys({
  username: userUsernameSchema.required(),
  password: userPasswordSchema.required()
})

const updateUserSchema = userSchema.keys({
  username: userUsernameSchema,
  password: userPasswordSchema
})

const getUserSchema = userSchema.keys({
  id: userIdSchema.required()
})

const deleteUserSchema = getUserSchema

export const userSchemas = {
  create: createUserSchema,
  update: updateUserSchema,
  get: getUserSchema,
  delete: deleteUserSchema
}

export default userSchemas
