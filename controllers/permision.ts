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
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const permissions = await this.permissionModel.getAll()
      res.status(200).json(permissions)
    } catch (error) {
      next(error)
    }
  }

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10)
      if (isNaN(id)) {
        throw boom.unauthorized("invalid id")
        return
      }
      const permission = await this.permissionModel.getById(id)
      if (!permission) {
        throw boom.notFound("permission not found")
        return
      }
      res.status(200).json(permission)
    } catch (error) {
      next(error)
    }
  }

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name }: CreatePermissionType = req.body
      if (!name) {
        throw boom.badRequest("All data is required")
        return
      }

      const newPermission: CreatePermissionType = {
        name
      }

      const createdPermission = await this.permissionModel.create(newPermission)

      res.status(201).json({
        message: "Permission created successfully",
        permission: createdPermission
      })
    } catch (erorr) {
      next(erorr)
    }
  }

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10)
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
      res.status(204).json({ message: "Permission deleted successfully" })
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
      const id = parseInt(req.params.id, 10)
      if (isNaN(id)) {
        throw boom.unauthorized("invalid id")
        return
      }
      const permission = await this.permissionModel.getById(id)
      if (!permission) {
        throw boom.notFound("permission not found")
        return
      }
      const { name }: UpdatePermissionType = req.body

      const data: UpdatePermissionType = {
        id,
        name
      }

      const updatedPermission = await this.permissionModel.update(data)

      res.status(201).json({
        message: "Permission updated successfully",
        permission: updatedPermission
      })
    } catch (error) {
      next(error)
    }
  }
} //end class
