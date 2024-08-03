import Joi from "joi"

//permission schema
const permissionIdSchema = Joi.number().integer().positive().required()
const permissionNameSchema = Joi.string().optional().max(255)
const permissionActiveSchema = Joi.boolean().default(false)

//permission create schema
const permissionSchema = Joi.object({
  id: permissionIdSchema,
  name: permissionNameSchema,
  active: permissionActiveSchema
})

//operation-specific permission schemas
const createPermissionSchema = permissionSchema.keys({
  name: permissionNameSchema,
  active: permissionActiveSchema
})

const updatePermissionSchema = createPermissionSchema

const getPermissionSchema = permissionSchema.keys({
  id: permissionIdSchema.required()
})

const deletePermissionSchema = getPermissionSchema

export const permissionSchemas = {
  create: createPermissionSchema,
  update: updatePermissionSchema,
  get: getPermissionSchema,
  delete: deletePermissionSchema
}

export default permissionSchemas
