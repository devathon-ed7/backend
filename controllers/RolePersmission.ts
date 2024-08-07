import { Request, Response, NextFunction } from "express"
import {
  CreateRolePermissionType,
  RolePermissionModelInterface
} from "../models/mariadb/RolePersmission"
import boom from "@hapi/boom"
import rolePermissionSchemas from "../schemas/RolePermission"

export class RolePersmissionController {
  private rolePermissionModel: RolePermissionModelInterface
  constructor({
    rolePermissionModel
  }: {
    rolePermissionModel: RolePermissionModelInterface
  }) {
    this.rolePermissionModel = rolePermissionModel
  }

  create = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log(request.body)
      const rolePermissions: CreateRolePermissionType[] = request.body

      // Validate the input using the updated schema
      const { error } = rolePermissionSchemas.create.validate(rolePermissions)
      if (error) {
        throw boom.badRequest(error.details[0].message)
      }

      const results = await Promise.all(
        rolePermissions.map(async (rolePermission) => {
          const { role_id, permission_id, active } = rolePermission
          const newRolePermission: CreateRolePermissionType = {
            role_id,
            permission_id,
            active
          }
          return await this.rolePermissionModel.create(newRolePermission)
        })
      )
      response.status(201).json({
        message: "Relation RolePermission created successfully",
        permission: results
      })
    } catch (error) {
      next(error)
    }
  }

  update = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { role_id, permission_id, new_role_id, new_permission_id } =
        request.body

      // check if role permission exists
      const existingRolePermission =
        await this.rolePermissionModel.getRolePermission({
          role_id,
          permission_id
        })

      if (!existingRolePermission) {
        throw boom.notFound("Role permission not found")
      }

      const updatedRolePermission = await this.rolePermissionModel.update(
        {
          role_id,
          permission_id
        },
        {
          role_id: new_role_id,
          permission_id: new_permission_id
        }
      )

      response.status(204).json({ rolePermission: updatedRolePermission })
    } catch (error) {
      next(error)
    }
  }

  getPermissionsForRole = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const role_id = parseInt(request.params.role_id, 10)

      const rolePermission =
        await this.rolePermissionModel.getPermissionsForRole(role_id)

      response.status(200).json({
        message: "Role permission found successfully",
        rolePermission
      })
    } catch (error) {
      next(error)
    }
  }
} //end class
