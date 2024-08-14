import Joi from "joi"

//user schema
const userIdSchema = Joi.number().integer().positive()
const userUsernameSchema = Joi.string().min(3).max(30)
const userPasswordSchema = Joi.string().optional().allow("").min(6).max(50)
const userDetailsIdSchema = Joi.number().integer().positive()
const userDetailsDescriptionSchema = Joi.string().optional().max(255)
const userDetailsNotesSchema = Joi.string().optional().max(255)
const userDetailsUserAccountIdSchema = Joi.number().integer().positive()
const userDetailsRoleIdSchema = Joi.number().integer().optional().positive()
const userDetailsProfileFilename = Joi.string().optional().max(255)
const userDetailsEmailSchema = Joi.string().optional().email()
const userDetailsNameSchema = Joi.string().optional().max(255)

//user create schema
const userSchema = Joi.object({
  id: userIdSchema,
  username: userUsernameSchema,
  password: userPasswordSchema
})

const createSchema = Joi.object({
  username: userUsernameSchema,
  password: userPasswordSchema,
  user_details: Joi.object({
    description: userDetailsDescriptionSchema,
    notes: userDetailsNotesSchema,
    role_id: userDetailsRoleIdSchema,
    email: userDetailsEmailSchema,
    name: userDetailsNameSchema
  })
})

const updateSchema = Joi.object({
  id: userIdSchema,
  username: userUsernameSchema,
  password: userPasswordSchema.optional(),
  user_details: Joi.object({
    id: userDetailsIdSchema,
    description: userDetailsDescriptionSchema,
    notes: userDetailsNotesSchema,
    user_account_id: userDetailsUserAccountIdSchema,
    role_id: userDetailsRoleIdSchema,
    profile_filename: userDetailsProfileFilename,
    email: userDetailsEmailSchema,
    name: userDetailsNameSchema
  })
})
//operation schema

const createUserSchema = createSchema.keys({
  user: createSchema
})

const updateUserSchema = updateSchema.keys({
  user: updateSchema
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
