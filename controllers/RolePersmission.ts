import { Request, Response, NextFunction } from "express"
import {
  CreateRolePermissionType,
  RolePermissionModelInterface
} from "../interfaces"
import boom from "@hapi/boom"
import rolePermissionSchemas from "../schemas/RolePermission"
import { getByNumberParam } from "../utils/controllerUtils"

interface RolePermissionRequest {
  role_id: number
  permission_id: number
  active: boolean
}
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
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const rolePermissions: CreateRolePermissionType[] = req.body

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
      res.status(201).json({
        message: "Relation RolePermission created successfully",
        permission: results
      })
    } catch (error) {
      next(error)
    }
  }

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const rolePermission: RolePermissionRequest[] =
        req.body["role-permission"]

      const updatePromises = rolePermission.map(async (permission) => {
        const id = {
          role_id: permission.role_id,
          permission_id: permission.permission_id
        }
        await this.rolePermissionModel.update(id, {
          role_id: permission.role_id,
          permission_id: permission.permission_id,
          active: permission.active
        })
      })

      await Promise.all(updatePromises)

      res.status(200).json({ message: "Role permissions updated successfully" })
    } catch (error) {
      next(error)
    }
  }

  getPermissionsForRole = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) =>
    await getByNumberParam(
      req,
      res,
      next,
      this.rolePermissionModel.getPermissionsForRole,
      "role-permission",
      "role_id",
      "number"
    )
} //end class
