import { Request, Response, NextFunction } from "express"
import {
  PermissionModelInterface,
  CreatePermissionType,
  UpdatePermissionType
} from "../models/mariadb/permission"
import boom from "@hapi/boom"

export class PermissionController {
  private permissionModel: PermissionModelInterface
  constructor({
    permissionModel
  }: {
    permissionModel: PermissionModelInterface
  }) {
    this.permissionModel = permissionModel
  }
  getAll = async (
    _request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const permissions = await this.permissionModel.getAll()
      response.status(200).json(permissions)
    } catch (error) {
      next(error)
    }
  }

  getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(request.params.id, 10)
      if (isNaN(id)) {
        throw boom.unauthorized("invalid id")
        return
      }
      const permission = await this.permissionModel.getById(id)
      if (!permission) {
        throw boom.notFound("permission not found")
        return
      }
      response.status(200).json(permission)
    } catch (error) {
      next(error)
    }
  }

  create = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name }: CreatePermissionType = request.body
      if (!name) {
        throw boom.badRequest("All data is required")
        return
      }

      const newPermission: CreatePermissionType = {
        name
      }

      const createdPermission = await this.permissionModel.create(newPermission)

      response.status(201).json({
        message: "Permission created successfully",
        permission: createdPermission
      })
    } catch (erorr) {
      next(erorr)
    }
  }

  delete = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(request.params.id, 10)
      if (isNaN(id)) {
        throw boom.unauthorized("invalid id")
        return
      }
      const permission = await this.permissionModel.getById(id)
      if (!permission) {
        throw boom.notFound("permission not found")
        return
      }
      await this.permissionModel.delete(id)
      response.status(204).json({ message: "Permission deleted successfully" })
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
      const id = parseInt(request.params.id, 10)
      if (isNaN(id)) {
        throw boom.unauthorized("invalid id")
        return
      }
      const permission = await this.permissionModel.getById(id)
      if (!permission) {
        throw boom.notFound("permission not found")
        return
      }
      const { name }: UpdatePermissionType = request.body

      const data: UpdatePermissionType = {
        id,
        name
      }

      const updatedPermission = await this.permissionModel.update(data)

      response.status(201).json({
        message: "Permission updated successfully",
        permission: updatedPermission
      })
    } catch (error) {
      next(error)
    }
  }
} //end class
