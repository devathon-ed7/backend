import Joi from "joi"

//role permission schema
const roleIdSchema = Joi.number().integer().positive().required()
const permissionIdSchema = Joi.number().integer().positive().required()
const permissionActiveSchema = Joi.boolean().default(false)

//role permission create schema
const rolePermissionSchema = Joi.object({
  role_id: roleIdSchema,
  permission_id: permissionIdSchema,
  active: permissionActiveSchema
})

//operation-specific role permission schemas
const createRolePermissionSchema = Joi.array()
  .items(
    rolePermissionSchema.keys({
      role_id: roleIdSchema.required(),
      permission_id: permissionIdSchema.required()
    })
  )
  .min(1)
  .required()

const updateRolePermissionSchema = Joi.object({
  "role-permission": Joi.array().items(rolePermissionSchema).required()
})
  


const getPermissionsForRoleSchema = Joi.object({
  role_id: roleIdSchema
})

export const rolePermissionSchemas = {
  create: createRolePermissionSchema,
  update: updateRolePermissionSchema,
  getPermissonsForRole: getPermissionsForRoleSchema
}

export default rolePermissionSchemas
